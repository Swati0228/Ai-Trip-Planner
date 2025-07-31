import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaShare } from "react-icons/fa6";
import { GetPlaceDetails } from '@/service/GlobalApi';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('');

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label
      };

      const resp = await GetPlaceDetails(data);
      const photoName = resp.data?.places?.[0]?.photos?.[9]?.name;

      if (photoName) {
        const dynamicPhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=1000 `;
        setPhotoUrl(dynamicPhotoUrl);
      } else {
        console.warn("No photo found");
      }
    } catch (error) {
      console.error("Failed to fetch photo:", error);
    }
  };

  useEffect(() => {
    if (trip) GetPlacePhoto();
  }, [trip]);

  return (
    <div>
      {/* Full-width Image Banner */}
      <div className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-3 mt-5">
          <img
            src={photoUrl || "https://via.placeholder.com/800x400?text=No+Image"}
            alt="Trip location"
            className="w-full h-[120px] md:h-[220px] lg:h-[400px] object-cover rounded-2xl shadow-md"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4">
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5'>
          <div className='flex flex-col gap-2'>
            <h2 className='font-bold text-lg sm:text-xl md:text-2xl mt-2 sm:mt-0'>
              {trip?.userSelection?.location?.label}
            </h2>
            <div className='flex flex-wrap gap-3 sm:gap-5 mt-2'>
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm'>
                📆 {trip?.userSelection?.noOfDays} Day
              </h2>
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm'>
                💰 {trip?.userSelection?.budget} Budget
              </h2>
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm'>
                💏 No. of traveler: {trip?.userSelection?.traveler}
              </h2>
            </div>
          </div>
          <Button className='mt-3 sm:mt-0 sm:ml-5'>
            <FaShare />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
