import axios from 'axios';
import { UNSPLASH_ACCESS_KEY } from '@/src/constants/api';

const unsplashApi = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
});

export interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    user: {
        name: string;
        username: string;
        links: {
            html: string;
        };
    };
    links: {
        html: string;
        download_location: string;
    };
    description: string | null;
    alt_description: string | null;
    color: string;
    width: number;
    height: number;
    likes: number;
}

export const searchMoodImages = async (
    mood: string,
    page: number = 1,
    perPage: number = 20
): Promise<UnsplashImage[]> => {
    // Map moods to search queries
    const moodQueries: Record<string, string> = {
        motivational: 'inspirational landscape mountain sunrise success',
        romantic: 'love couple sunset flowers heart romantic',
        peaceful: 'nature calm zen meditation peaceful lake forest',
        focused: 'minimal workspace clean desk concentration',
        confident: 'powerful strong achievement winner success',
        grateful: 'thankful gratitude nature blessing sunrise',
    };

    const query = moodQueries[mood] || mood;

    try {
        const response = await unsplashApi.get('/search/photos', {
            params: {
                query,
                page,
                per_page: perPage,
                orientation: 'portrait', // Better for phone wallpapers
                order_by: 'relevant',
            },
        });

        return response.data.results;
    } catch (error) {
        console.error('Unsplash search error:', error);
        return [];
    }
};

export const triggerDownload = async (downloadLocation: string) => {
    // Required by Unsplash API to track downloads
    try {
        await unsplashApi.get(downloadLocation);
    } catch (error) {
        console.error('Download tracking error:', error);
    }
};