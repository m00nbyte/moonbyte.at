// modules
import fs from 'fs';
import path from 'path';
import progress from 'rollup-plugin-progress';
import { cleandir } from 'rollup-plugin-cleandir';
import watch from 'rollup-plugin-watch';
import copy from 'rollup-plugin-copy';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import typescript from 'rollup-plugin-typescript2';
import dynamicImports from '@rollup/plugin-dynamic-import-vars';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { minify } from 'html-minifier-terser';
import stripCode from 'rollup-plugin-strip-code';
import stripDebug from '@rollup/plugin-strip';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';
import { visualizer } from 'rollup-plugin-visualizer';
import json from '@rollup/plugin-json';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import cssnano from 'cssnano';

// local
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');
const { gtm_id } = createRequire(import.meta.url)('./src/config.json');

// prod build
const production = process.env.NODE_ENV === 'production';

// #region plugins
const loadHTMLFiles = (filePaths) => {
    const htmlContent = {};

    filePaths.forEach((filePath) => {
        try {
            // Read file synchronously and extract filename without extension
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileNameWithoutExtension = path.basename(filePath, path.extname(filePath));

            // Store content using the filename without extension as the key
            htmlContent[fileNameWithoutExtension] = content;
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
        }
    });

    return htmlContent;
};

const processHtmlFile = ({ entry, output }) =>
    html({
        template: async () => {
            const filePaths = ['src/layout/index.html', 'src/layout/navbar.html', 'src/layout/footer.html', entry];

            const htmlContent = loadHTMLFiles(filePaths);
            const { index: layout, navbar, footer } = htmlContent;
            const content = htmlContent[path.basename(entry, path.extname(entry))];

            return await minify(
                layout
                    .replace('<!-- NAVBAR -->', navbar)
                    .replace('<!-- SECTIONS -->', content)
                    .replace('<!-- FOOTER -->', footer)
                    .replace('<!-- GTM_ID -->', gtm_id),
                {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    processScripts: ['application/ld+json', 'text/plain'],
                    useShortDoctype: true,
                    minifyCSS: true,
                    minifyJS: true
                }
            );
        },
        fileName: output
    });

const mainPlugins = [
    tsConfigPaths(),
    typescript({ useTsconfigDeclarationDir: true }),
    json(),
    dynamicImports(),
    commonjs(),
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
    })
];

const htmlPlugins = [
    ...[
        { entry: 'src/pages/main.html', output: 'index.html' },
        { entry: 'src/pages/disclaimer.html', output: 'disclaimer.html' },
        { entry: 'src/pages/privacy.html', output: 'privacy.html' }
    ].map(processHtmlFile),
    copy({
        targets: [
            {
                src: ['public/*'],
                dest: 'dist'
            }
        ]
    }),
    generateSW({
        swDest: 'dist/sw.js',
        cacheId: 'html',
        globDirectory: 'dist/',
        globPatterns: ['**/*.html'],
        skipWaiting: true,
        clientsClaim: true,
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        navigateFallback: 'offline.html',
        navigateFallbackAllowlist: [new RegExp('/'), new RegExp('/disclaimer'), new RegExp('/privacy')],
        runtimeCaching: [
            {
                urlPattern: /\.(?:js|css)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'dynamic',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 7 * 24 * 60 * 60
                    }
                }
            },
            {
                urlPattern: /\.(?:webp|webm|jpg|png|svg)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'media',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60
                    }
                }
            },
            {
                urlPattern: ({ request }) => request.mode === 'navigate',
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'pages',
                    networkTimeoutSeconds: 3,
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 24 * 60 * 60
                    }
                }
            }
        ]
    })
];

const productionPlugins = [
    stripCode({
        start_comment: 'NO_PRODUCTION_START',
        end_comment: 'NO_PRODUCTION_END'
    }),
    stripDebug({
        debugger: true,
        sourceMap: true,
        functions: ['assert.*']
    }),
    replace({
        preventAssignment: true,
        ...[
            { key: 'NODE_ENV', value: 'production' },
            { key: 'MODULE_NAME', value: pkg.name },
            { key: 'MODULE_VERSION', value: pkg.version }
        ].reduce((obj, { key, value }) => ({ ...obj, [`process.env.${key}`]: JSON.stringify(value) }), {})
    }),
    terser({
        toplevel: false,
        compress: {
            passes: 4
        },
        output: {
            ascii_only: true,
            preamble: [
                '/*',
                `    Ⓒ __copyright __company\n`,
                '    package:  __projectName',
                '    version:  __buildVersion',
                '    date:     __buildDate',
                '*/'
            ].join('\n')
        }
    }),
    replace({
        preventAssignment: true,
        __copyright: new Date().getFullYear(),
        __company: pkg.author.split(' ')[0],
        __projectName: pkg.name,
        __buildVersion: pkg.version,
        __buildDate: () => new Date().toUTCString()
    }),
    ...['treemap', 'sunburst'].reduce(
        (arr, type) =>
            arr.push(
                visualizer({
                    filename: `./stats/${type}_${pkg.version}_${new Date().getTime()}.html`,
                    template: type,
                    gzipSize: true,
                    brotliSize: true
                })
            ) && arr,
        []
    )
];

const developmentPlugins = [
    watch({ dir: 'src' }),
    replace({
        preventAssignment: true,
        __buildVersion: `${pkg.version}-dev`
    })
];
// #endregion

// #region builds
const jsBuild = {
    input: 'src/index.ts',
    output: [
        {
            file: './dist/bundle.min.js',
            format: 'es'
        }
    ],
    external: (id) => {
        if (Object.keys(pkg.dependencies || {}).includes(id) || id === 'module') return true;
        return false;
    },
    plugins: [
        progress({
            clearLine: true
        }),
        cleandir('./dist'),
        ...mainPlugins,
        ...htmlPlugins,
        ...(production ? productionPlugins : developmentPlugins)
    ]
};

const cssBuild = {
    input: 'src/styles/index.sass',
    output: [
        {
            file: './dist/bundle.min.css',
            format: 'es'
        }
    ],
    onwarn: (warning, defaultHandler) => {
        if (warning.code !== 'FILE_NAME_CONFLICT') {
            defaultHandler(warning);
        }
    },
    plugins: [
        progress({
            clearLine: true
        }),
        postcss({
            extract: true,
            minimize: true,
            plugins: [
                tailwindcss(),
                autoprefixer(),
                cssnano({
                    preset: [
                        'default',
                        {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    ]
                })
            ]
        })
    ]
};
// #endregion

export default [jsBuild, cssBuild];
