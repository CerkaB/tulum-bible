const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

// Get a list of all files in the /src directory
const srcDir = './src';
const files = fs.readdirSync(srcDir);

// Create full paths for each file
const entryPoints = files.map(file => path.join(srcDir, file));

esbuild
    .build({
        entryPoints: entryPoints,
        bundle: true,
        minify: true,
        sourcemap: false,
        outdir: 'dist',
    })
    .catch(() => process.exit(1));