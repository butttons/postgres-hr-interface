const { colors } = require('tailwindcss/defaultTheme');
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
            },
        },
        fontFamily: {
            display: ['Raleway', 'sans-serif'],
            body: ['Lato', 'sans-serif'],
        },
    },
    variants: {
        backgroundColor: [
            'responsive',
            'hover',
            'focus',
            'group-hover',
            'focus-within',
        ],
        textColor: ['responsive', 'hover', 'focus', 'group-hover'],
        borderColor: [
            'responsive',
            'hover',
            'focus',
            'active',
            'group-hover',
            'focus-within',
        ],
    },
    plugins: [],
};
