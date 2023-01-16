import { PSVError, Point, Position, Size, Viewer, utils } from '@photo-sphere-viewer/core';
import { Color, Group, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, PointLight, Texture, TextureLoader, Vector3 } from 'three';
import { Lensflare, LensflareElement } from './Lensflare.js';
import { LensflareConfig } from './model.js';
import { LENSFLARE_DATA } from './constants.js';
import { HEXANGLE, LIGHT, FLARE_1, FLARE_2, FLARE_3 } from './textures/index.js';

export class LensflareObject {
    private loader: TextureLoader;
    private textureFlare: { [key: string]: Texture };
    private readonly element: Object3D;
    visible = true;

    get id(): string {
        return this.config.id;
    }

    get domElement(): HTMLElement | SVGElement {
        return null;
    }

    get threeElement(): Object3D {
        return this.element;
    }

    /** @internal */
    readonly state = {
        dynamicSize: false,
        anchor: null as Point,
        visible: true,
        position: null as Position,
        position2D: null as Point,
        positions3D: null as Vector3[],
        size: null as Size,
    };

    constructor(private readonly viewer: Viewer, private config: LensflareConfig) {
        if (!config.id) {
            throw new PSVError('missing lensflare id');
        }

        this.loader = new TextureLoader();

        this.textureFlare = {};
        this.textureFlare["light"] = (this.loader.load(LIGHT));
        this.textureFlare["flare1"] = (this.loader.load(FLARE_1));
        this.textureFlare["flare2"] = (this.loader.load(FLARE_2));
        this.textureFlare["flare3"] = (this.loader.load(FLARE_3));
        this.textureFlare["diaphragm"] = (this.loader.load(HEXANGLE));

        if (!config.color) {
            this.config.color = { h: 0.08, s: 0.2, l: 0.5 };
        }

        if (!config.position) {
            this.config.position = { yaw: 0, pitch: 0 };
        }
        this.state.position = this.viewer.dataHelper.cleanPosition(this.config.position);

        if (!config.size) {
            this.config.size = { width: 1, height: 1 };
        }

        this.element = this.__createMesh();

        if (this.viewer.config.withCredentials) {
            this.loader.setWithCredentials(true);
        }

        this.update(config);
    }

    destroy() {
        // do your cleanup logic here
        delete this.threeElement.children[0].userData[LENSFLARE_DATA];
    }

    public addLight(h: number, s: number, l: number, x: number, y: number, z: number) {
        const light = new PointLight(0xffffff, 1.5, 2000);
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);

        switch (this.config.type) {
            case 0:
            default:
                const lensflare = new Lensflare();
                lensflare.addElement(new LensflareElement(this.textureFlare["light"], 700, 0, light.color));
                lensflare.addElement(new LensflareElement(this.textureFlare["flare2"], 800, 0.1));
                lensflare.addElement(new LensflareElement(this.textureFlare["diaphragm"], 130, 0.45, new Color(0x02fa12)));
                lensflare.addElement(new LensflareElement(this.textureFlare["diaphragm"], 110, 0.55, new Color(0x00ff12)));
                lensflare.addElement(new LensflareElement(this.textureFlare["flare3"], 70, 0.7, new Color(0x0223a3)));
                lensflare.addElement(new LensflareElement(this.textureFlare["flare3"], 80, 0.8, new Color(0x02fa12)));
                lensflare.addElement(new LensflareElement(this.textureFlare["flare3"], 120, 0.85));
                light.add(lensflare);
                break;
        }
        return light;
    }

    /**
     * Updates the lensflare with new properties
     * @throws {@link PSVError} if the configuration is invalid
     * @internal
     */
    update(config: LensflareConfig) {
        if (utils.isExtendedPosition(config)) {
            utils.logWarn('Use the "position" property to configure the position of a lensflare');
            config.position = this.viewer.dataHelper.cleanPosition(config);
        }

        if ('width' in config && 'height' in config) {
            utils.logWarn('Use the "size" property to configure the size of a lensflare');
            // @ts-ignore
            config.size = { width: config['width'], height: config['height'] };
        }

        this.config = utils.deepmerge(this.config, config as any);
        if (this.config.scale && Array.isArray(this.config.scale)) {
            this.config.scale = { zoom: this.config.scale as any };
        }

        this.visible = this.config.visible !== false;

        this.state.anchor = utils.parsePoint(this.config.anchor);

        this.__update3d();
    }

    /**
     * Updates a 3D lensflare
     */
    private __update3d() {
        const element = this.threeElement;

        if (!utils.isExtendedPosition(this.config.position)) {
            throw new PSVError('missing lensflare position');
        }

        this.state.dynamicSize = false;
        //this.state.size = this.config.size;

        // convert texture coordinates to spherical coordinates
        this.state.position = this.viewer.dataHelper.cleanPosition(this.config.position);

        // compute x/y/z position
        this.state.positions3D = [this.viewer.dataHelper.sphericalCoordsToVector3(this.state.position)];

        (element.children[0] as Mesh).position.set(this.state.anchor.x - 0.5, this.state.anchor.y - 0.5, 0);

        (element.children[0] as Mesh<any, MeshBasicMaterial>).material.opacity = this.config.opacity ?? 1;

        element.position.copy(this.state.positions3D[0]);

        switch (this.config.orientation) {
            case 'horizontal':
                element.lookAt(0, element.position.y, 0);
                element.rotateX(this.state.position.pitch < 0 ? -Math.PI / 2 : Math.PI / 2);
                break;
            case 'vertical-left':
                element.lookAt(0, 0, 0);
                element.rotateY(-Math.PI * 0.4);
                break;
            case 'vertical-right':
                element.lookAt(0, 0, 0);
                element.rotateY(Math.PI * 0.4);
                break;
            default:
                element.lookAt(0, 0, 0);
                break;
        }

        // 100 is magic number that gives a coherent size at default zoom level
        element.scale.set(this.config.size.width / 100, this.config.size.height / 100, 1);
    }

    private __createMesh() {
        const p = this.viewer.dataHelper.sphericalCoordsToVector3(this.state.position)
        //console.log(p)
        const light = this.addLight(this.config.color.h, this.config.color.s, this.config.color.l, p.x, p.y, 1);
        const material = new MeshBasicMaterial({
            transparent: true,
            opacity: 1,
            depthTest: false,
        });
        const geometry = new PlaneGeometry(0, 0);
        const mesh = new Mesh(geometry, material);
        mesh.userData = { [LENSFLARE_DATA]: this };
        const element = new Group().add(mesh).add(light);

        // overwrite the visible property to be tied to the lensflare instance
        // and do it without context bleed
        Object.defineProperty(element, 'visible', {
            enumerable: true,
            get: function (this: Object3D) {
                return (this.children[0].userData[LENSFLARE_DATA] as LensflareObject).visible;
            },
            set: function (this: Object3D, visible: boolean) {
                (this.children[0].userData[LENSFLARE_DATA] as LensflareObject).visible = visible;
            },
        });

        return element;
    }
}