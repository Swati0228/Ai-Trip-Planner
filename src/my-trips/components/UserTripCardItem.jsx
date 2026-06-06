import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label
      };
      const resp = await GetPlaceDetails(data);
      const places = resp?.data?.places;
      if (places && places.length > 0) {
        const photos = places[0].photos;
        if (photos && photos.length > 0) {
          const photoIndex = photos.length > 3 ? 3 : 0;
          const photoName = photos[photoIndex]?.name;
          if (photoName) {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
            setPhotoUrl(PhotoUrl);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load user trip photo:', err);
    }
  };

  return (
    <Link to={`/view-trip/${trip?.id}`}>
      <div className='hover:scale-105 transition-all'>
        <img src={photoUrl ? photoUrl : '/placeholder.svg'} alt="" className='object-cover rounded-xl h-[220px] w-full' />
        <div>
          <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
          <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} budget. </h2>
        </div>
      </div>
    </Link >
  )
}

export default UserTripCardItem