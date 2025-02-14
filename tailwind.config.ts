import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'got': {
          'primary': '#C41E3A',     // Rojo Lannister
          'secondary': '#1E3A8A',   // Azul Stark
          'accent': '#FFD700',      // Dorado Targaryen
          'tech': '#00FF9C',        // Verde neón tech
          // Modo claro
          light: {
            'bg': '#F8F9FA',
            'card': '#FFFFFF',
            'text': '#1A1A1A',
            'border': '#E2E8F0'
          },
          // Modo oscuro
          dark: {
            'bg': '#0F172A',        // Azul muy oscuro
            'card': '#1E293B',      // Azul oscuro
            'text': '#E2E8F0',
            'border': '#334155'
          }
        }
      },
      backgroundImage: {
        'gradient-tech': 'linear-gradient(45deg, #C41E3A 0%, #1E3A8A 100%)',
        'gradient-got': 'linear-gradient(to right, #C41E3A, #FFD700)',
      },
      fontFamily: {
        'got': ['Cinzel', 'serif'],      // Para títulos estilo GoT
        'tech': ['Space Grotesk', 'sans-serif']  // Para texto tech
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.got.tech), 0 0 20px theme(colors.got.tech)',
        'got': '0 4px 6px -1px rgba(196, 30, 58, 0.1), 0 2px 4px -1px rgba(196, 30, 58, 0.06)',
      }
    },
  },
  plugins: [],
}

export default config;
