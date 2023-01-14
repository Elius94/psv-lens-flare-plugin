export default {
    input: 'index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'PhotoSphereViewerLensflarePlugin',
            sourcemap: true,
            globals: {
                'three': 'THREE',
                '@photo-sphere-viewer/core': 'PhotoSphereViewer',
            },
        },
        {
            file: 'dist/index.module.js',
            format: 'es',
            sourcemap: true,
        },
    ],
    external: [
        'three', 
        '@photo-sphere-viewer/core',
    ],
};