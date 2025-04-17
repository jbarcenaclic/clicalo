import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        clicalo: {
          azul: '#0052A4',
          amarillo: '#FFD633',
          amarilloHover: '#F8B100',
          grisTexto: '#E5E5E5',
        },
      },
    },
  },
  plugins: [],
}
export default config;
