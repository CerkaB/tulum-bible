require("esbuild")
    .build({
     entryPoints: ["index.js", "date-picker.css"], 
     bundle: true, 
     minify: true,
     sourcemap: false,  
     outdir: "dist",
    })
    .catch(() => process.exit(1));