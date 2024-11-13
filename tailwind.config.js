/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts,json}'],
    corePlugins: {
        float: false
    },
    theme: {
        fontFamily: {
            display: ['Megrim'],
            body: ['Fira Sans']
        },
        extend: {
            keyframes: {
                wave: {
                    '0%': { transform: 'rotate(0.0deg)' },
                    '15%': { transform: 'rotate(14.0deg)' },
                    '30%': { transform: 'rotate(-8.0deg)' },
                    '40%': { transform: 'rotate(14.0deg)' },
                    '50%': { transform: 'rotate(-4.0deg)' },
                    '60%': { transform: 'rotate(10.0deg)' },
                    '70%': { transform: 'rotate(0.0deg)' },
                    '100%': { transform: 'rotate(0.0deg)' }
                },
                heart: {
                    '0%, 20%, 50%, 80%': {
                        transform: 'scale(1)'
                    },
                    '40%': {
                        transform: 'scale(1.2)'
                    },
                    '60%': {
                        transform: 'scale(1.1)'
                    }
                }
            },
            animation: {
                wave: 'wave 1.5s infinite',
                heart: 'heart 1.5s infinite'
            }
        }
    },
    plugins: [
        // require('@tailwindcss/forms'),
        require('@iconify/tailwind').addDynamicIconSelectors()
    ]
};
