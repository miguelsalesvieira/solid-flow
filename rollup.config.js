// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import typescript from "rollup-plugin-typescript2";
// import postcss from "rollup-plugin-postcss";
// import json from "@rollup/plugin-json";
// import withSolid from "rollup-preset-solid";

// const packageJson = require("./package.json");

// export default {
//     input: "./src/index.ts",
//     output: [
//         {
//             file: packageJson.main,
//             format: "cjs",
//             sourcemap: true,
//         },
//         {
//             file: packageJson.module,
//             format: "esm",
//             sourcemap: true,
//         },
//     ],
//     plugins: [
//         resolve(),
//         commonjs(),
//         typescript({
//             useTsconfigDeclarationDir: true,
//             rollupCommonJSResolveHack: true,
//         }),
//         postcss(),
//         json(),
//     ],
// };

// rollup.config.js

import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import withSolid from "rollup-preset-solid";

const packageJson = require("./package.json");

export default withSolid([
    {
        input: "./src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            postcss(),
            typescript({
                useTsconfigDeclarationDir: true,
            }),
        ],
    },
]);
