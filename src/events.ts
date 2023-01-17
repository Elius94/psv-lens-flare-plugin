import { TypedEvent } from '@photo-sphere-viewer/core';
import type { LensflarePlugin } from 'src';
import { LensflareObject } from './LensflareObject';

/**
 * Base class for events dispatched by {@link LensflaresPlugin}
 */
export abstract class LensflaresPluginEvent extends TypedEvent<LensflarePlugin> { }

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
 * @event Triggered when the lensflares change
 */
export class SetLensflaresEvent extends LensflaresPluginEvent {
    static override readonly type = 'set-lensflares';

    constructor(public readonly lensflares: LensflareObject[]) {
        super(SetLensflaresEvent.type);
    }
}

export type LensflaresPluginEvents =
    | LensflareVisibilityEvent
    | SetLensflaresEvent;