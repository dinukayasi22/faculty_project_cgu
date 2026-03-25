/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#A67C52',
                secondary: '#F5F5DC',
                accent: '#D4AF37',
                background: {
                    DEFAULT: '#FFFFFF',
                    muted: '#F8F8F8',
                },
                text: {
                    DEFAULT: '#333333',
                    muted: '#FFFFFF',
                },
                danger: '#DC3545',
            },
        },
    },
    plugins: [],
}
