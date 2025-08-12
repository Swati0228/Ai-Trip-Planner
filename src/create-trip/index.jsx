import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

   const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      if (!tokenInfo?.access_token) {
        console.error("❌ Access token not found in tokenInfo:", tokenInfo);
        return;
      }
  
      // Fetch user info from Google
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: 'application/json'
        }
      });
  
      const userData = response.data;
      console.log("✅ Google user info response:", userData);
  
      // Save user to localStorage
      //local storage stores only string methods
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("✅ Saved user to localStorage:", localStorage.getItem("user"));
  
      // Close the sign-in dialog and generate the trip
      setOpenDialog(false);
      OnGenerateTrip();
  
    } catch (error) {
      console.error("❌ Failed to fetch user info from Google:", error);
    }
  };
  

  const OnGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user?.email) {
      console.log("User not found");
      setOpenDialog(true);
      return;
    }

    if (
      formData?.noOfDays > 50 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all details!");
      return;
    }

    toast("Form generated.");
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget);

    console.log("AI PROMPT: ", FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const text = await result?.response?.text();

    setLoading(false);
    SaveAiTrip(text);
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const docId = Date.now().toString();

    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });

    setLoading(false);
    navigate('/view-trip/' + docId);
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl mt-16 '>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-20 flex flex-col gap-9'>
        {/* Destination */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { setPlace(v); handleInputChange('location', v); },
            }}
          />
        </div>

        {/* Number of Days */}
        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning the trip?</h2>
          <Input
            placeholder='Ex. 3'
            type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.budget === item.title && 'shadow-lg border-black'
                }`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler Type */}
        <div>
          <h2 className='text-xl my-3 font-medium'>Who are you traveling with?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.traveler === item.people && 'shadow-lg border-black'
                }`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="my-10 flex justify-end">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            'Generate Trip'
          )}
        </Button>
      </div>

      {/* Google Sign-in Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <img src="/logo.svg" alt="Logo" className="mb-4 mx-auto" />
            <DialogTitle className="text-lg font-bold text-center">
              Sign in With Google
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 text-center">
              Sign in to the App with Google Authentication Security
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={login}
            className="w-full mt-5 gap-4 items-center justify-center"
          >
            <FcGoogle className='h-5 w-5' />
            Sign in with Google
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
