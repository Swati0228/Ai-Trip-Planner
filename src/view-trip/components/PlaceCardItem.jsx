import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        place && GetPlaceImg();
    }, [place]);

    const GetPlaceImg = async () => {
        try {
            const result = await GetPlaceDetails({
                textQuery: place.placeName,
            });
            const photoRef = result?.data?.places?.[0]?.photos?.[0]?.name;
            if (photoRef) {
                const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
                setPhotoUrl(photoUrl);
            }
        } catch (err) {
            console.error('Photo fetch failed:', err);
        }
    };

    return (
        <Link
            to={
                'https://www.google.com/maps/search/?api=1&query=' +
                place?.placeName +
                ',' +
                place?.geoCoordinates
            }
            target="_blank"
        >
            <div className="flex border rounded-lg p-3 gap-5 bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer w-full h-[200px]">
                {/* Image */}
                <div>
                    <img
                        src={photoUrl || '/road-trip-vocation.jpg'}
                        alt={place.placeName}
                        className="w-[340px] h-[104%] rounded-lg object-cover"
                    />
                </div>
              
                {/* Details */} 
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h2 className="font-medium text-sm text-orange-600">{place.day}</h2>
                        <h2 className="font-bold text-base text-black-800">{place.placeName}</h2>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {place.placeDetails}
                        </p>
                        
                        
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-black-600">{place.ticketPricing}</p>
                            <p className="text-xs text-yellow-500">⭐ {place.rating}</p>
                            <p className="text-[10px] italic text-gray-500">{place.timeTravel}</p>
                        </div>
                        <Button className="rounded-full p-2">
                            <FaLocationDot />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PlaceCardItem;
