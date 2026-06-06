import React, { useRef } from 'react';
import PlaceCardItem from './PlaceCardItem';
import ExportPDF from './ExportPDF';

function PlacesToVisit({ trip }) {
  const itineraryRef = useRef(null);

  return (
    <div>
      <div className='flex justify-between items-center mt-10 mb-7'>
        <h2 className='font-bold text-lg'>Places to Visit</h2>
        <ExportPDF
          itineraryRef={itineraryRef}
          tripDetails={{ location: trip?.userSelection?.location?.label }}
        />
      </div>

      <div ref={itineraryRef}>
        {trip.tripData && typeof trip.tripData.itinerary === 'object' ? (
          Object.entries(trip.tripData.itinerary)
            .sort(([dayA], [dayB]) => {
              const numA = parseInt(dayA.replace(/\D/g, ''), 10);
              const numB = parseInt(dayB.replace(/\D/g, ''), 10);
              return numA - numB;
            })
            .map(([day, info]) => (
              <div key={day} className='mt-5'>
                <h3 className='font-medium text-lg text-black-700'>{day}</h3>
                <p className='font-medium text-sm text-orange-300'>{info.best_time_to_visit}</p>
                <div className='grid md:grid-cols-2 gap-5'>
                  {info.places.map((place, index) => (
                    <div key={index}>
                      <div className='my-3'>
                        <PlaceCardItem place={place} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p>No itinerary available</p>
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;