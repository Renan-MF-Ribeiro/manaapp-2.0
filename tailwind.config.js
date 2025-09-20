/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#35A9FF',
                    50: '#F3FAFF',
                    100: '#E6F5FF',
                    200: '#BFEBFF',
                    300: '#99DFFF',
                    400: '#66D0FF',
                    500: '#35A9FF',
                    600: '#218FCC',
                    700: '#176B99',
                    800: '#0F4766',
                    900: '#072633',
                },
                background: {
                    DEFAULT: '#E6F5FF',
                    dark: '#34495e',
                    light: '#46627f',
                },
            },
        },
    },
    plugins: [],
};
