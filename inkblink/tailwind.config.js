module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(50%)', opacity: '0' },  // Start slightly below
          '50%': { transform: 'translateY(0)', opacity: '1' },   // Peak at center
          '100%': { transform: 'translateY(-50%)', opacity: '0' }, // End above
        },
      },
      animation: {
        'slide-up': 'slide-up 1s ease-in-out infinite', // Adjusted duration to match cycle
      },
    },
  },
};
