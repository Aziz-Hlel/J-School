
## rootDir
- It only tells the compiler: “When emitting files, treat this as the root of the source tree.” in other words, if the rootDir is not provided, or set to "." the dist folder would come out like this : 
dist/
├── src/
│   ├── index.js
│   └── utils/
│       └── helper.js

while if we set rootDir to "src" the dist folder would come out like this : 
dist/
├── index.js
└── utils/
    └── helper.js


## outDir
- The directory in which to output the emitted files. In other words, this is the folder where your compiled code will be placed, usually set to "dist", but be aware that you always need to provide rootDir, otherwise It emits files right next to the source files
project/
├── src/
│   ├── index.ts
│   ├── index.js        ❗ emitted here
│   ├── utils/
│   │   ├── helper.ts
│   │   └── helper.js   ❗ emitted here


## include  
- This tells TypeScript: “Only these files are part of the project — ignore everything else.”
- You almost always need to set "include" to ["src/**/*"] to prevent "node_modules" and "dist" from being included
- When you set include you increased LSP performance because include : 
    ✔ Limits what gets indexed
    ✔ Reduces memory + CPU usage
    ✔ Speeds up IntelliSense dramatically


## exclude
- You almost always need to set "exclude" to ["**/node_modules", "**/dist"] to prevent "node_modules" and "dist" from being included
- Note that if you set include to ["src/**/*"] you don't need to set exclude
    

## incremental
- Speeds up subsequent builds by reusing previous compilation state
- Enabled by default when you set `"incremental": true` or `"composite": true`


## tsBuildInfoFile
- Used when: `"incremental": true`, OR `"composite": true` (implicitly enables incremental)
- Specifies where TypeScript stores incremental build metadata
- Default location: project root (file name: `.tsbuildinfo`)
- Recommended to place it inside the build output directory (e.g., `dist/`) to keep build artifacts isolated and avoid stale state issues when cleaning or resetting builds


## composite
- Enables a project to be part of TypeScript project references (monorepo builds)
- Automatically enables incremental compilation
- Requires output to be well-defined (must have rootDir and outDir)
- Requires declaration files to be generated ("declaration": true)
- Used with: `tsc -b` (build mode)
- Purpose: Turns a TypeScript project into a buildable module that can be depended on by other TS projects (for example packages in a monorepo)

