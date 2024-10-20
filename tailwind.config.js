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
            backgroundImage: {
                'gradient-radial': 'radial-gradient(ellipse at bottom, #1b2735 0, #090a0f 100%)'
            },
            skew: {
                30: '30deg'
            },
            keyframes: {
                chevron: {
                    '25%': {
                        opacity: 1
                    },
                    '33.3%': {
                        opacity: 1,
                        transform: 'translateY(2.28rem)'
                    },
                    '66.6%': {
                        opacity: 1,
                        transform: 'translateY(3.12rem)'
                    },
                    '100%': {
                        opacity: 0,
                        transform: 'translateY(4.8rem) scale(0.5)'
                    }
                },
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
                },
                'slide-left': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-100%)' }
                }
            },
            animation: {
                chevron1: 'chevron 3s ease-out 0s infinite',
                chevron2: 'chevron 3s ease-out 1s infinite',
                chevron3: 'chevron 3s ease-out 2s infinite',
                wave: 'wave 1.5s infinite',
                heart: 'heart 1.5s infinite',
                'slide-left-infinite': 'slide-left 30s linear infinite'
            }
        },
        deliciousHamburgers: {
            size: '33px', // must be in px.
            color: '#fff',
            colorLight: '#fff',
            padding: '4px', // must be in px.
            animationSpeed: 1
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@iconify/tailwind').addDynamicIconSelectors(),
        require('tailwindcss-delicious-hamburgers')
    ]
};
