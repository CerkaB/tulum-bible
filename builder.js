require("esbuild")
    .build({
     entryPoints: ["date-picker-venues.js", "date-picker.css"], 
     bundle: true, 
     minify: true,
     sourcemap: false,  
     outdir: "dist",
    })
    .catch(() => process.exit(1));