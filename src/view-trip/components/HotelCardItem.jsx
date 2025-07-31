import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalApi';

function HotelCardItem({ item }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (item) {
      fetchHotelPhoto();
    }
  }, [item]);

  const fetchHotelPhoto = async () => {
    try {
      const data = {
        textQuery: item?.hotelName
      };

      const response = await GetPlaceDetails(data);
      const photoRef = response?.data?.places?.[0]?.photos?.[0]?.name;

      if (photoRef) {
        const url = `https://places.googleapis.com/v1/${photoRef}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`;
        setPhotoUrl(url);
      } else {
        console.warn('No photo reference found for:', item?.hotelName);
      }
    } catch (error) {
      console.error('Failed to load hotel photo:', error);
    }
  };

  return (
    <div>
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${item?.hotelName},${item?.hotelAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="hover:scale-105 transition-all cursor-pointer">
          <img
            src={photoUrl || '/fallback-hotel.jpg'} // Use a real fallback image from /public
            alt={item?.hotelName}
            className="rounded-xl h-[180px] w-full object-cover"
          />
          <div className="my-3 py-2">
            <h2 className="font-medium">{item?.hotelName}</h2>
            <h2 className="text-xs text-gray-500">📍 {item?.hotelAddress}</h2>
            <h2 className="text-sm">💰 {item?.price}</h2>
            <h2 className="text-sm">⭐ {item?.rating}</h2>
            {item?.travelTime && (
              <h2 className="text-sm text-gray-600">🕒 {item.travelTime} to reach</h2>
            )}
            {item?.day && (
              <h2 className="text-sm text-gray-600">📅 Day {item.day}</h2>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;
