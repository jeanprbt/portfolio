import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    modules: ['@nuxt/fonts', '@nuxt/icon'],
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
                { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
                { rel: 'manifest', href: '/site.webmanifest' }
            ],
            meta: [
                { name: 'theme-color', content: '#000000' },
                { name: 'msapplication-TileColor', content: '#000000' }
            ]
        }
    }
})