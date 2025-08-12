import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalApi';

function HotelCard({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    fetchPhoto();
  }, []);

  const fetchPhoto = async () => {
    try {
      const response = await GetPlaceDetails({ textQuery: hotel?.hotelName });
      const photoRef = response?.data?.places?.[0]?.photos?.[0]?.name;

      if (photoRef) {
        const url = `https://places.googleapis.com/v1/${photoRef}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`;
        setPhotoUrl(url);
      } else {
        console.warn('No photo reference found for:', hotel?.hotelName);
      }
    } catch (err) {
      console.error('Failed to fetch hotel image:', err);
    }
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName} ${hotel?.hotelAddress}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer overflow-hidden">
        <img
          src={photoUrl || "/fallback-hotel.jpg"}
          alt={hotel?.hotelName}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">{hotel?.hotelName}</h3>
          <p className="text-sm text-gray-500 mt-1">📍 {hotel?.hotelAddress}</p>
          <p className="text-sm text-gray-600 mt-1">💰 {hotel?.price}</p>
          <p className="text-sm text-yellow-600 mt-1">⭐ {hotel?.rating}</p>
        </div>
      </div>
    </Link>
  );
}

function Hotels({ trip }) {
  return (
    <div className="max-w-26xl mx-auto px-4 mt-10">
      <h2 className="font-bold text-2xl mb-6 text-gray-800">Hotel Recommendation</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-start">
        {trip?.tripData?.hotelOptions
          ?.sort((a, b) => a.day - b.day)
          ?.map((hotel, index) => (
            <HotelCard key={index} hotel={hotel} />
          ))}
      </div>
    </div>
  );
}

export default Hotels;
