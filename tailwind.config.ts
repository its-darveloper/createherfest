import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        urbanist: ['var(--font-urbanist)'],
      },
      fontSize: {
        // Urbanist Headers
        'title-sm': ['1.75rem', {
          lineHeight: '2.25rem',
          letterSpacing: '-0.02em',
          fontWeight: '800'
        }],
        'title-md': ['2.25rem', {
          lineHeight: '2.75rem',
          letterSpacing: '-0.02em',
          fontWeight: '800'
        }],
        'title-lg': ['2.75rem', {
          lineHeight: '3.25rem',
          letterSpacing: '-0.02em',
          fontWeight: '800'
        }],
        'subtitle-sm': ['1.5rem', {
          lineHeight: '2rem',
          letterSpacing: '-0.02em',
          fontWeight: '700'
        }],
        'subtitle-md': ['1.875rem', {
          lineHeight: '2.375rem',
          letterSpacing: '-0.02em',
          fontWeight: '700'
        }],
        'subtitle-lg': ['2.25rem', {
          lineHeight: '2.75rem',
          letterSpacing: '-0.02em',
          fontWeight: '700'
        }],
        'heading-sm': ['1.25rem', {
          lineHeight: '1.75rem',
          letterSpacing: '-0.01em',
          fontWeight: '600'
        }],
        'heading-md': ['1.625rem', {
          lineHeight: '2.125rem',
          letterSpacing: '-0.01em',
          fontWeight: '600'
        }],
        'heading-lg': ['1.875rem', {
          lineHeight: '2.375rem',
          letterSpacing: '-0.01em',
          fontWeight: '600'
        }],
        'subheading-sm': ['1.125rem', {
          lineHeight: '1.5rem',
          fontWeight: '500'
        }],
        'subheading-md': ['1.3125rem', {
          lineHeight: '1.75rem',
          fontWeight: '500'
        }],
        'subheading-lg': ['1.5rem', {
          lineHeight: '2rem',
          fontWeight: '500'
        }],
        
        // Inter Content
        'section-sm': ['1rem', {
          lineHeight: '1.5rem',
          fontWeight: '500'
        }],
        'section-md': ['1.125rem', {
          lineHeight: '1.625rem',
          fontWeight: '500'
        }],
        'section-lg': ['1.25rem', {
          lineHeight: '1.75rem',
          fontWeight: '500'
        }],
        'body-sm': ['0.875rem', {
          lineHeight: '1.25rem',
          fontWeight: '400'
        }],
        'body-md': ['0.9375rem', {
          lineHeight: '1.375rem',
          fontWeight: '400'
        }],
        'body-lg': ['1rem', {
          lineHeight: '1.5rem',
          fontWeight: '400'
        }],
        'quote-sm': ['0.9375rem', {
          lineHeight: '1.375rem',
          fontWeight: '400'
        }],
        'quote-md': ['1rem', {
          lineHeight: '1.5rem',
          fontWeight: '400'
        }],
        'quote-lg': ['1.125rem', {
          lineHeight: '1.625rem',
          fontWeight: '400'
        }],
        'caption-sm': ['0.75rem', {
          lineHeight: '1.125rem',
          fontWeight: '300'
        }],
        'caption-md': ['0.8125rem', {
          lineHeight: '1.25rem',
          fontWeight: '300'
        }],
        'caption-lg': ['0.875rem', {
          lineHeight: '1.375rem',
          fontWeight: '300'
        }],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;