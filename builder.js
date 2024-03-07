require("esbuild")
    .build({
     entryPoints: ["index.js", "date-picker.css"], 
     bundle: true, 
     minify: false,
     sourcemap: false,  
     outdir: "dist",
    })
    .catch(() => process.exit(1));