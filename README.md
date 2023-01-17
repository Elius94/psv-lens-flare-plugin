# photo-sphere-viewer-lensflare-plugin
 Plugin to add lens flares to a Photo Sphere Viewer (Library: [PhotoSphereViewer](https://github.com/mistic100/Photo-Sphere-Viewer)) by [mistic100](https://github.com/mistic100)

 ![lensflare](https://user-images.githubusercontent.com/14907987/212742055-8db7599e-2e93-4303-b979-9762f803483d.gif)

## Installation

### NPM

```sh
npm install photo-sphere-viewer-lensflare-plugin
```

### Yarn

```sh
yarn add photo-sphere-viewer-lensflare-plugin
```

## Usage

### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer-lensflare-plugin/dist/index.min.js"></script>
```

### JavaScript

```js
import PhotoSphereViewerLensflarePlugin from 'photo-sphere-viewer-lensflare-plugin';
```

```js
const viewer = new PhotoSphereViewer.Viewer({
    container: document.querySelector('#viewer'),
    panorama: 'pano.jpg',
    plugins: [
        [PhotoSphereViewerLensflarePlugin, {
            lensflares: [
                {
                    id: 'sun',
                    position: { yaw: '145deg', pitch: '2deg' },
                    type: 0,
                }
            ]
        }]
    ]
});
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `lensflares` | `Array` | `[]` | Array of lens flares |

### Lens Flare Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `String` | `''` | ID of the lens flare |
| `position` | `Object` | `{ yaw: '0deg', pitch: '0deg' }` | Position of the lens flare |
| `type` | `Number` | `0` | Type of the lens flare (available: 0) |
| `color` | `HSL` | `{ h: 0.08, s: 0.2, l: 0.5 }` | Color of the lens flare |


## Examples

### Run the provided example

```sh
npm run test
```

### Add multiple lens flares

```js
const viewer = new PhotoSphereViewer.Viewer({
    container: document.querySelector('#viewer'),
    panorama: 'pano.jpg',
    defaultYaw: 20.75,
    defaultPitch: 0.17,
    plugins: [
        [PhotoSphereViewerLensflarePlugin, {
            lensflares: [
                {
                    id: 'sun',
                    position: { yaw: '145deg', pitch: '2deg' },
                },
                {
                    id: 'moon',
                    position: { yaw: '30.6deg', pitch: '41.2deg' },
                    color: { h: 0.6, s: 0.5, l: 0.2 },
                }
            ]
        }]
    ]
});
```

### Result of the example

![multilens](https://user-images.githubusercontent.com/14907987/212864401-fa0861c7-b089-4681-b290-dce7a4a7c669.gif)
