import type { ExtendedPosition, Position, Size } from '@photo-sphere-viewer/core';

export type HSL = {
    h: number;
    s: number;
    l: number;
};

/**
 * Configuration of a lensflare
 */
export type LensflareConfig = {
    /**
     * Unique identifier of the lensflare
     */
    id: string;
    type: number;
    /**
     * Position of the lensflare (required but for `polygon` and `polyline`)
     */
    position?: ExtendedPosition;
    /**
     * The "hsl" color of the lensflare
     * @default [0.08, 0.2, 0.5]
     * @see https://en.wikipedia.org/wiki/HSL_and_HSV
     * @see https://www.w3schools.com/colors/colors_hsl.asp
     */
    color?: HSL;
    /**
     * Size of the lensflare (required for `image` and `imageLayer`, recommended for `html`, ignored for others)
     */
    size?: Size;
    /**
     * Applies a perspective on the image to make it look like placed on the floor or on a wall (only for `imageLayer`)
     */
    orientation?: 'front' | 'horizontal' | 'vertical-left' | 'vertical-right';
    /**
     * Configures the scale of the lensflare depending on the zoom level and/or the horizontal offset (ignored for `polygon`, `polyline` and `imageLayer`)
     */
    scale?:
        | [number, number]
        | { zoom?: [number, number]; yaw?: [number, number] }
        | ((zoomLevel: number, position: Position) => number);
    /**
     * Opacity of the lensflare
     * @default 1
     */
    opacity?: number;
    /**
     * CSS class(es) added to the lensflare element (ignored for `imageLayer`)
     */
    className?: string;
    /**
     * CSS properties to set on the lensflare (background, border, etc.) (ignored for `imagerLayer`)
     */
    style?: Record<string, string>;
    /**
     * Defines where the lensflare is placed toward its defined position
     * @default 'center center'
     */
    anchor?: string;
    /**
     * The zoom level which will be applied when calling `gotoLensflare()` method or when clicking on the lensflare in the list
     * @default `current zoom level`
     */
    zoomLvl?: number;
    /**
     * Initial visibility of the lensflare
     * @default true
     */
    visible?: boolean;
};

export type ParsedLensflareConfig = Omit<LensflareConfig, 'scale'> & {
    scale?:
        | { zoom?: [number, number]; yaw?: [number, number] }
        | ((zoomLevel: number, position: Position) => number);
};

export type LensflarePluginConfig = {
    /**
     * initial lensflares
     */
    lensflares?: LensflareConfig[];
};