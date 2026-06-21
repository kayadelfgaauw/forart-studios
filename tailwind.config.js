/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d2b48c", // Muted Tan (UI elements and interaction points)
        accent: "#E57E25",  // Burnt Sunset Orange (highlights & focus)
        bunker: "#001247",  // Deep Sea Blue (Background)
        softwhite: "#E8E4DD", // Soft Porcelain (Text)
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Michroma", "sans-serif"],
        drama: ["Ogg", "Cormorant Garamond", "serif"],
        data: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
