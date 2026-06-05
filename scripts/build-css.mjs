// Ships the canonical material stylesheet (css/jelly.css) with the package:
// a verbatim copy + an esbuild-minified copy. esbuild only strips whitespace,
// so modern features (color-mix, relative colour, @property) survive intact.
import { transform } from 'esbuild';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const SRC = 'css/jelly.css';

await mkdir('dist', { recursive: true });
const css = await readFile(SRC, 'utf8');
await copyFile(SRC, 'dist/jelly.css');

const { code } = await transform(css, { loader: 'css', minify: true });
await writeFile('dist/jelly.min.css', code);

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)}kB`;
console.log(`✓ css → dist/jelly.css (${kb(css)}) + dist/jelly.min.css (${kb(code)})`);
