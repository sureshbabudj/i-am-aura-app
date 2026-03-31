import axios from 'axios';
import { PEXELS_API_KEY } from '@/src/constants/api';

const pexelsApi = axios.create({
    baseURL: 'https://api.pexels.com/v1',
    headers: {
        Authorization: PEXELS_API_KEY,
    },
});

export const searchPexelsImages = async (
    mood: string,
    page: number = 1,
    perPage: number = 20
) => {
    const moodQueries: Record<string, string> = {
        motivational: 'inspirational motivation success',
        romantic: 'romantic love couple',
        peaceful: 'peaceful nature calm',
        focused: 'focus minimal workspace',
        confident: 'confident strong powerful',
        grateful: 'grateful gratitude nature',
    };

    const query = moodQueries[mood] || mood;

    try {
        const response = await pexelsApi.get('/search', {
            params: {
                query,
                page,
                per_page: perPage,
                orientation: 'portrait',
            },
        });

        return response.data.photos.map((photo: any) => ({
            id: photo.id,
            url: photo.src.portrait,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            width: photo.width,
            height: photo.height,
            source: 'pexels',
        }));
    } catch (error) {
        console.error('Pexels search error:', error);
        return [];
    }
};