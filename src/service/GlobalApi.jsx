import axios from "axios";

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'  // ✅ Comma-separated string
  }
};

// ✅ Function to send the POST request to get place details
export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

// ✅ Function to get full photo URL from photo.name
export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=800&maxWidthPx=1200&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;


export const getPhotoUrl = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;
