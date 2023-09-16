import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import withSolid from "rollup-preset-solid";

import packageJson from "./package.json" assert {type: "json"}; 

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
