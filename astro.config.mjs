import { defineConfig } from 'astro/config';
import { config_global } from './src/theme-simple/config'

const { url } = config_global
// https://astro.build/config
export default defineConfig({
    site: url,
    outDir: "docs",
});
