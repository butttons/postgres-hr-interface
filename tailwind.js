const { colors } = require('tailwindcss/defaultTheme');
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: colors.indigo,
            },
        },

        fontFamily: {
            display: ['Raleway', 'sans-serif'],
            body: ['Lato', 'sans-serif'],
        },
    },
    variants: {},
    plugins: [],
};
