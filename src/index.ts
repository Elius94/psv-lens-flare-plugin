import { AbstractPlugin, PSVError, Point, Viewer, events, utils } from '@photo-sphere-viewer/core';
import { LensflareConfig, LensflarePluginConfig } from './model.js';
import { LENSFLARE_DATA } from './constants.js';
import { LensflareObject } from './LensflareObject.js';
import { LensflareVisibilityEvent, LensflaresPluginEvents, SetLensflaresEvent } from './events.js';

const getConfig = utils.getConfigParser<LensflarePluginConfig>({
    lensflares: null,
});

export class LensflarePlugin extends AbstractPlugin<LensflaresPluginEvents> {
    static override readonly id = 'lensflare';

    readonly config: LensflarePluginConfig;
    private readonly lensflares: Record<string, LensflareObject> = {};

    private readonly state = {
        visible: true,
        currentLensflare: null as LensflareObject,
        hoveringLensflare: null as LensflareObject,
    };

    constructor(viewer: Viewer, config: LensflarePluginConfig) {
        super(viewer);
        this.config = getConfig(config);
        this.renderLensflares();
    }

    override init() {
        super.init();
        this.viewer.addEventListener(events.RenderEvent.type, this);
        this.viewer.addEventListener(events.ReadyEvent.type, this, { once: true });
    }

    override destroy() {
        // do your cleanup logic here
        this.clearLensflares(false);
        this.viewer.removeEventListener(events.RenderEvent.type, this);
        this.viewer.removeEventListener(events.ReadyEvent.type, this);
        super.destroy();
    }

    /**
    * @internal
    */
    handleEvent(e: Event) {
        switch (e.type) {
            case events.ReadyEvent.type:
                if (this.config.lensflares) {
                    this.setLensflares(this.config.lensflares);
                    delete this.config.lensflares;
                }
                break;

            case events.RenderEvent.type:
                this.renderLensflares();
                break;
        }
    }

    /**
     * Toggles all lensflares
     */
    toggleAllLensflares() {
        if (this.state.visible) {
            this.hideAllLensflares();
        } else {
            this.showAllLensflares();
        }
    }

    /**
     * Shows all lensflares
     */
    showAllLensflares() {
        this.state.visible = true;

        this.renderLensflares();
    }

    /**
     * Hides all lensflares
     */
    hideAllLensflares() {
        this.state.visible = false;

        this.renderLensflares();
    }

    /**
     * Returns the total number of lensflares
     */
    getNbLensflares(): number {
        return Object.keys(this.lensflares).length;
    }

    /**
     * Returns all the lensflares
     */
    getLensflares(): LensflareObject[] {
        return Object.values(this.lensflares);
    }

    /**
     * Adds a new Lensflare to viewer
     * @throws {@link PSVError} when the lensflare's id is missing or already exists
     */
    addLensflare(config: LensflareConfig, render = true) {
        if (this.lensflares[config.id]) {
            throw new PSVError(`lensflare "${config.id}" already exists`);
        }

        const lensflare = new LensflareObject(this.viewer, config);

        this.viewer.renderer.addObject(lensflare.threeElement);

        this.lensflares[lensflare.id] = lensflare;

        if (render) {
            this.__afterChangerLensflares();
        }
    }

    /**
     * Returns the internal lensflare object for a lensflare id
     * @throws {@link PSVError} when the lensflare cannot be found
     */
    getLensflare(lensflareId: string | LensflareConfig): LensflareObject {
        const id = typeof lensflareId === 'object' ? lensflareId.id : lensflareId;

        if (!this.lensflares[id]) {
            throw new PSVError(`cannot find lensflare "${id}"`);
        }

        return this.lensflares[id];
    }

    /**
     * Returns the last lensflare selected by the user
     */
    getCurrentLensflare(): LensflareObject {
        return this.state.currentLensflare;
    }

    /**
     * Updates the existing lensflare with the same id
     * @description Every property can be changed but you can't change its type (Eg: `image` to `html`)
     */
    updateLensflare(config: LensflareConfig, render = true) {
        const lensflare = this.getLensflare(config.id);

        lensflare.update(config);

        if (render) {
            this.__afterChangerLensflares();
        }
    }

    /**
     * Removes a lensflare from the viewer
     */
    removeLensflare(lensflareId: string | LensflareConfig, render = true) {
        const lensflare = this.getLensflare(lensflareId);

        this.viewer.renderer.removeObject(lensflare.threeElement);

        if (this.state.currentLensflare === lensflare) {
            this.state.currentLensflare = null;
        }

        lensflare.destroy();
        delete this.lensflares[lensflare.id];

        if (render) {
            this.__afterChangerLensflares();
        }
    }

    /**
     * Removes multiple lensflares
     */
    removeLensflares(lensflareIds: string[], render = true) {
        lensflareIds.forEach((lensflareId) => this.removeLensflare(lensflareId, false));

        if (render) {
            this.__afterChangerLensflares();
        }
    }

    /**
     * Replaces all lensflares
     */
    setLensflares(lensflares: LensflareConfig[], render = true) {
        this.clearLensflares(false);

        lensflares?.forEach((lensflare) => {
            this.addLensflare(lensflare, false);
        });

        if (render) {
            this.__afterChangerLensflares();
        }
    }

    /**
     * Removes all lensflares
     */
    clearLensflares(render = true) {
        Object.keys(this.lensflares).forEach((lensflareId) => {
            this.removeLensflare(lensflareId, false);
        });

        if (render) {
            this.__afterChangerLensflares();
        }
    }

    /**
     * Hides a lensflare
     */
    hideLensflare(lensflareId: string | LensflareConfig) {
        this.toggleLensflare(lensflareId, false);
    }

    /**
     * Shows a lensflare
     */
    showLensflare(lensflareId: string | LensflareConfig) {
        this.toggleLensflare(lensflareId, true);
    }

    /**
    * Toggles a lensflare visibility
    */
    toggleLensflare(lensflareId: string | LensflareConfig, visible?: boolean) {
        const lensflare = this.getLensflare(lensflareId);
        lensflare.visible = visible === null ? !lensflare.visible : visible;
        this.viewer.needsUpdate();
    }

    /**
    * Updates the visibility and the position of all lensflares
    */
    renderLensflares() {
        Object.values(this.lensflares).forEach((lensflare) => {
            let isVisible = this.state.visible && lensflare.visible;
            let visibilityChanged = false;
            let position: Point = null;

            visibilityChanged = lensflare.state.visible !== isVisible;
            lensflare.state.visible = isVisible;
            lensflare.state.position2D = isVisible ? position : null;

            if (visibilityChanged) {
                this.dispatchEvent(new LensflareVisibilityEvent(lensflare, isVisible));
            }
        });
    }

    private __afterChangerLensflares() {
        this.__checkObjectsObserver();
        this.viewer.needsUpdate();
        this.dispatchEvent(new SetLensflaresEvent(this.getLensflares()));
    }

    /**
     * Adds or remove the objects observer if there are 3D lensflares
     */
    private __checkObjectsObserver() {
        this.viewer.observeObjects(LENSFLARE_DATA);
    }
}