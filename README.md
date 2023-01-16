# photo-sphere-viewer-lensflare-plugin
 Plugin to add lens flares to a Photo Sphere Viewer (Library: [PhotoSphereViewer](https://github.com/mistic100/Photo-Sphere-Viewer)) by [mistic100](https://github.com/mistic100)

 ![lensflare](https://user-images.githubusercontent.com/14907987/212742055-8db7599e-2e93-4303-b979-9762f803483d.gif)

## Installation

### NPM

```bash
npm install photo-sphere-viewer-lensflare-plugin
```

### Yarn

```bash
yarn add photo-sphere-viewer-lensflare-plugin
```

## Usage

### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer-lensflare-plugin/index.min.js"></script>
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
