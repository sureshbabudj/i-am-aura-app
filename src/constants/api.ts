// API Keys - Store these securely using Expo Secure Store in production
// These are fallback values for development only

export const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY || '';
export const UNSPLASH_SECRET_KEY = process.env.EXPO_PUBLIC_UNSPLASH_SECRET_KEY || '';

export const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY || '';

export const PIXABAY_API_KEY = process.env.EXPO_PUBLIC_PIXABAY_API_KEY || '';

// API Configuration
export const API_CONFIG = {
    unsplash: {
        baseUrl: 'https://api.unsplash.com',
        perPage: 20,
        orientation: 'portrait',
    },
    pexels: {
        baseUrl: 'https://api.pexels.com/v1',
        perPage: 20,
        orientation: 'portrait',
    },
    pixabay: {
        baseUrl: 'https://pixabay.com/api',
        perPage: 20,
        orientation: 'vertical',
        safesearch: true,
    },
};

// Rate Limiting (requests per hour)
export const RATE_LIMITS = {
    unsplash: 50,    // Demo key limit
    pexels: 200,     // Free tier
    pixabay: 100,    // Free tier
};

// Image Quality Settings
export const IMAGE_QUALITY = {
    wallpaper: {
        width: 1080,
        height: 1920,
        quality: 90,
    },
    thumbnail: {
        width: 400,
        height: 600,
        quality: 80,
    },
    preview: {
        width: 200,
        height: 300,
        quality: 60,
    },
};

// Attribution Templates
export const ATTRIBUTION_TEMPLATES = {
    unsplash: (photographer: string, username: string) =>
        `Photo by ${photographer} (@${username}) on Unsplash`,
    pexels: (photographer: string) =>
        `Photo by ${photographer} on Pexels`,
    pixabay: (user: string) =>
        `Image by ${user} from Pixabay`,
};