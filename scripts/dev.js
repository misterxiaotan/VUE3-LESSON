

import minimist from "minimist";
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import esbuild from 'esbuild'
import { createRequire } from "module";
// 获取命令行的参数
const args = minimist(process.argv.slice(2));

const target = args._[0] || 'reactivify'; //打包项目
const format = args.f || 'iife';//打包后的模块规范

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

esbuild.context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    platform: 'browser',
    sourcemap: true,
    format,
}).then((ctx) => {
    console.log('success')
    return ctx.watch()
})
