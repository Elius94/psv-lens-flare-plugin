import { utils } from '@photo-sphere-viewer/core';

/**
 * Property name added to lensflare elements
 * @internal
 */
export const LENSFLARE_DATA = 'psvLensflare';

/**
 * Property name added to lensflare elements (dash-case)
 * @internal
 */
export const LENSFLARE_DATA_KEY = utils.dasherize(LENSFLARE_DATA);

/**
 * Panel identifier for lensflare content
 * @internal
 */
export const ID_PANEL_LENSFLARE = 'lensflare';

/**
 * Panel identifier for lensflares list
 * @internal
 */
export const ID_PANEL_LENSFLARES_LIST = 'lensflaresList';
