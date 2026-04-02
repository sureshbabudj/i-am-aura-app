import type { Config } from 'tailwindcss';
import { colors } from './src/constants/colors';

// @ts-ignore
import preset from 'nativewind/preset';

console.log(colors);

export default {
  content: ['./src/**/*.{js,ts,tsx}'],
  presets: [preset],
  theme: {
    extend: {
      colors,
      fontFamily: {
        'noto-serif': ['NotoSerif_400Regular'],
        'noto-serif-italic': ['NotoSerif_400Regular_Italic'],
        'noto-serif-bold': ['NotoSerif_700Bold'],
        'noto-serif-bold-italic': ['NotoSerif_700Bold_Italic'],
        'noto-serif-black': ['NotoSerif_900Black'],
        'noto-serif-black-italic': ['NotoSerif_900Black_Italic'],
        'manrope-extralight': ['Manrope_200ExtraLight'],
        'manrope-light': ['Manrope_300Light'],
        manrope: ['Manrope_400Regular'],
        'manrope-medium': ['Manrope_500Medium'],
        'manrope-semibold': ['Manrope_600SemiBold'],
        'manrope-bold': ['Manrope_700Bold'],
        'manrope-extrabold': ['Manrope_800ExtraBold'],
        serif: ['NotoSerif_400Regular'],
        sans: ['Manrope_400Regular'],
      },
      borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        '7xl': '3.5rem',
        '8xl': '4rem',
        '9xl': '4.5rem',
        '10xl': '5rem',
      },
      shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '3xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
        '4xl': '0 45px 70px -15px rgb(0 0 0 / 0.3)',
        '5xl': '0 55px 80px -15px rgb(0 0 0 / 0.3)',
        '6xl': '0 65px 90px -15px rgb(0 0 0 / 0.3)',
        '7xl': '0 75px 100px -15px rgb(0 0 0 / 0.3)',
        '8xl': '0 85px 110px -15px rgb(0 0 0 / 0.3)',
        '9xl': '0 95px 120px -15px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;
