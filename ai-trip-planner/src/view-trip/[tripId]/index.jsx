import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlaceToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  // Get trip from firebase
  const GetTripData = async () => {
    const docRef = doc(db, 'AiTrips', tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document");
      toast('No Trip Found');
    }
  };

  return (
   

      <div className="bg-white/80 backdrop-blur-sm min-h-screen p-10 md:px-20 lg:px-44 xl:px-56">
        {/* Information Section */}
        <InfoSection trip={trip} />

        {/* Recommended Hotels */}
        <Hotels trip={trip} />

        {/* Display Plan */}
        <PlacesToVisit trip={trip} />

        {/* Footer */}
        <Footer />
      </div>
    
  );
}

export default Viewtrip;
