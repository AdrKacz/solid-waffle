import { resolve } from 'path'
import { globSync } from 'glob'

const files = globSync(
    ['**/*.html', '**/*.css', '**/*.mjs'],
    { ignore: ['dist/**', 'node_modules/**', 'vite.config.js*'] })
    .map((file) => resolve(__dirname, file))

const jsFiles = globSync('**/*.js', { ignore: ['dist/**', 'node_modules/**', 'vite.config.js*'] })
if (jsFiles.length > 0) {
    throw new Error(`JavaScript files are not allowed in the web package: ${jsFiles.join(', ')}`)
}

/** @type {import('vite').UserConfig} */
export default {
    // config options
    build: { rollupOptions: { input: files } },
}