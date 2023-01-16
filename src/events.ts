import { TypedEvent } from '@photo-sphere-viewer/core';
import type { LensflarePlugin } from 'src';
import { LensflareObject } from './LensflareObject';

/**
 * Base class for events dispatched by {@link LensflaresPlugin}
 */
export abstract class LensflaresPluginEvent extends TypedEvent<LensflarePlugin> {}

/**
 * @event Triggered when the visibility of a lensflare changes
 */
export class LensflareVisibilityEvent extends LensflaresPluginEvent {
    static override readonly type = 'lensflare-visibility';

    constructor(public readonly lensflare: LensflareObject, public readonly visible: boolean) {
        super(LensflareVisibilityEvent.type);
    }
}

/**
 * @event Triggered when the animation to a lensflare is done
 */
export class GotoLensflareDoneEvent extends LensflaresPluginEvent {
    static override readonly type = 'goto-lensflare-done';

    constructor(public readonly lensflare: LensflareObject) {
        super(GotoLensflareDoneEvent.type);
    }
}

/**
 * @event Triggered when the user puts the cursor away from a lensflare
 */
export class LeaveLensflareEvent extends LensflaresPluginEvent {
    static override readonly type = 'leave-lensflare';

    constructor(public readonly lensflare: LensflareObject) {
        super(LeaveLensflareEvent.type);
    }
}

/**
 * @event Triggered when the user puts the cursor hover a lensflare
 */
export class EnterLensflareEvent extends LensflaresPluginEvent {
    static override readonly type = 'enter-lensflare';

    constructor(public readonly lensflare: LensflareObject) {
        super(EnterLensflareEvent.type);
    }
}

/**
 * @event Triggered when the user clicks on a lensflare
 */
export class SelectLensflareEvent extends LensflaresPluginEvent {
    static override readonly type = 'select-lensflare';

    constructor(
        public readonly lensflare: LensflareObject,
        public readonly doubleClick: boolean,
        public readonly rightClick: boolean
    ) {
        super(SelectLensflareEvent.type);
    }
}

/**
 * @event Triggered when a lensflare is selected from the side panel
 */
export class SelectLensflareListEvent extends LensflaresPluginEvent {
    static override readonly type = 'select-lensflare-list';

    constructor(public readonly lensflare: LensflareObject) {
        super(SelectLensflareListEvent.type);
    }
}

/**
 * @event Triggered when a lensflare was selected and the user clicks elsewhere
 */
export class UnselectLensflareEvent extends LensflaresPluginEvent {
    static override readonly type = 'unselect-lensflare';

    constructor(public readonly lensflare: LensflareObject) {
        super(UnselectLensflareEvent.type);
    }
}

/**
 * @event Triggered when the lensflares are hidden
 */
export class HideLensflaresEvent extends LensflaresPluginEvent {
    static override readonly type = 'hide-lensflares';

    constructor() {
        super(HideLensflaresEvent.type);
    }
}

/**
 * @event Triggered when the lensflares change
 */
export class SetLensflaresEvent extends LensflaresPluginEvent {
    static override readonly type = 'set-lensflares';

    constructor(public readonly lensflares: LensflareObject[]) {
        super(SetLensflaresEvent.type);
    }
}

/**
 * @event Triggered when the lensflares are shown
 */
export class ShowLensflaresEvent extends LensflaresPluginEvent {
    static override readonly type = 'show-lensflares';

    constructor() {
        super(ShowLensflaresEvent.type);
    }
}

/**
 * @event Used to alter the list of lensflares displayed in the side-panel
 */
export class RenderLensflaresListEvent extends LensflaresPluginEvent {
    static override readonly type = 'render-lensflares-list';

    constructor(
        /** the list of lensflares to display, can be modified */
        public lensflares: LensflareObject[]
    ) {
        super(RenderLensflaresListEvent.type);
    }
}

export type LensflaresPluginEvents =
    | LensflareVisibilityEvent
    | LeaveLensflareEvent
    | EnterLensflareEvent
    | HideLensflaresEvent
    | SetLensflaresEvent
    | ShowLensflaresEvent
    | RenderLensflaresListEvent;