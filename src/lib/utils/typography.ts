// lib/utils/typography.ts
export const typography = {
    // Base classes (mobile first)
    title: 'font-urbanist text-title-sm sm:text-title-md lg:text-title-lg tracking-tight',
    subtitle: 'font-urbanist text-subtitle-sm sm:text-subtitle-md lg:text-subtitle-lg tracking-tight',
    heading: 'font-urbanist text-heading-sm sm:text-heading-md lg:text-heading-lg',
    subheading: 'font-urbanist text-subheading-sm sm:text-subheading-md lg:text-subheading-lg',
    
    // Content typography
    section: 'font-inter text-section-sm sm:text-section-md lg:text-section-lg',
    body: 'font-inter text-body-sm sm:text-body-md lg:text-body-lg',
    quote: 'font-inter text-quote-sm sm:text-quote-md lg:text-quote-lg italic',
    caption: 'font-inter text-caption-sm sm:text-caption-md lg:text-caption-lg',
  } as const;