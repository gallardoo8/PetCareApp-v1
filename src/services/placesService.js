    import axios from 'axios';
    import { GOOGLE_PLACES_API_KEY } from '@env';

    const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

    export const placesService = {
    // Buscar veterinarias cercanas
    async searchNearbyVeterinaries(latitude, longitude, radius = 5000) {
        try {
        const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
            params: {
            location: `${latitude},${longitude}`,
            radius: radius,
            type: 'veterinary_care',
            key: GOOGLE_PLACES_API_KEY,
            },
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
            console.error('API Error:', response.data.status);
            throw new Error(`API Error: ${response.data.status}`);
        }

        return response.data.results || [];
        } catch (error) {
        console.error('Error buscando veterinarias:', error);
        throw error;
        }
    },

    // Buscar veterinarias 24/7 (emergencia)
    async search24HourVeterinaries(latitude, longitude, radius = 10000) {
        try {
        const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
            params: {
            location: `${latitude},${longitude}`,
            radius: radius,
            type: 'veterinary_care',
            keyword: '24 hours emergency veterinaria',
            key: GOOGLE_PLACES_API_KEY,
            },
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
            console.error('API Error:', response.data.status);
            throw new Error(`API Error: ${response.data.status}`);
        }

        const places = response.data.results || [];

        // Obtener detalles de cada lugar
        const placesWithDetails = await Promise.all(
            places.slice(0, 10).map(async (place) => {
            try {
                const details = await this.getPlaceDetails(place.place_id);
                return {
                ...place,
                ...details,
                };
            } catch (error) {
                console.error('Error obteniendo detalles:', error);
                return place;
            }
            })
        );

        return placesWithDetails;
        } catch (error) {
        console.error('Error buscando veterinarias 24/7:', error);
        throw error;
        }
    },

    // Obtener detalles de un lugar específico
    async getPlaceDetails(placeId) {
        try {
        const response = await axios.get(`${BASE_URL}/details/json`, {
            params: {
            place_id: placeId,
            fields: 'name,formatted_address,formatted_phone_number,opening_hours,rating,geometry,business_status',
            key: GOOGLE_PLACES_API_KEY,
            },
        });

        if (response.data.status !== 'OK') {
            console.error('Details API Error:', response.data.status);
            return {};
        }

        return response.data.result;
        } catch (error) {
        console.error('Error obteniendo detalles:', error);
        return {};
        }
    },

    // Calcular distancia entre dos puntos (Fórmula de Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    toRad(value) {
        return (value * Math.PI) / 180;
    },
    };