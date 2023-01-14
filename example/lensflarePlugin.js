(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@photo-sphere-viewer/core'), require('three')) :
    typeof define === 'function' && define.amd ? define(['exports', '@photo-sphere-viewer/core', 'three'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PhotoSphereViewerLensflarePlugin = {}, global.PhotoSphereViewer, global.THREE));
})(this, (function (exports, core, three) { 'use strict';

    class LensflarePlugin extends core.AbstractPlugin {
        static id = 'lensflare-plugin';
        light;

        constructor(viewer, config) {
            super(viewer);
            this.textureLoader = new three.TextureLoader();
            this.lensflare = new Lensflare();
            this.config = config;
        }
        
        init() {
            // do your initialisation logic here
            this.light = new three.PointLight(0xffffff, 1.5, 2000);
            this.textureFlare[0] = this.textureLoader.load("textures/lensflare0.png");
            this.textureFlare[1] = this.textureLoader.load("textures/lensflare3.png");
            this.textureFlare[2] = this.textureLoader.load("textures/lensflare2.png");
            this.textureFlare[3] = this.textureLoader.load("textures/lensflare3.png");

            this.lensflare.addElement(new LensflareElement(this.textureFlare[0], 700, 0));
            this.lensflare.addElement(new LensflareElement(this.textureFlare[1], 60, 0.6));
            this.lensflare.addElement(new LensflareElement(this.textureFlare[2], 70, 0.7));
            this.lensflare.addElement(new LensflareElement(this.textureFlare[3], 120, 0.9));
        
            this.light.add(this.lensflare);
        }

        destroy() {
            // do your cleanup logic here
            super.destroy();
            this.light.remove(this.lensflare);
            this.lensflare = null;
            this.light = null;
        }
    }

    exports.LensflarePlugin = LensflarePlugin;

}));
//# sourceMappingURL=index.js.map
