module.exports = {
  theme: {
    extend: {
      keyframes: {
        ["popup-right"]: {
          "0%": { transform: "translateX(-50%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
    },
  },
};
