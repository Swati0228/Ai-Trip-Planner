import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaPlaneDeparture } from "react-icons/fa";

import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog.jsx';
import { googleLogout } from '@react-oauth/google';

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user'))
  );

  useEffect(() => {
    console.log("✅ Current user:", user);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/oauth2/v1/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: 'application/json'
            }
          }
        );

        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setOpenDialog(false);
      } catch (error) {
        console.error('❌ Failed to fetch user info from Google:', error);
      }
    },
    onError: (error) => console.log('❌ Google login error:', error)
  });

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6 shadow">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="https://www.onlinelogomaker.com/blog/wp-content/uploads/2017/09/travel-logo-design.jpg"
          alt="Logo"
          className="h-12 w-auto"
        />
        {/* Optional: Text beside logo */}
        {/* <span className="text-xl font-bold text-gray-800">TripAI</span> */}
      </div>

      {/* Right side (My Trips + User) */}
      {user ? (
        <div className="ml-auto flex items-center gap-4">
          <a href="/my-trips">
            <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
              <FaPlaneDeparture />
              My Trips
            </button>
          </a>
          <Popover>
            <PopoverTrigger>
              <img
                src={user.picture}
                className="h-9 w-9 rounded-full cursor-pointer border border-gray-300"
                alt="User"
              />
            </PopoverTrigger>
            <PopoverContent className="text-center shadow-lg w-auto rounded-md p-2 bg-white border-none">
              <h2
                className="cursor-pointer text-red-600 hover:underline text-sm"
                onClick={handleLogout}
              >
                Logout
              </h2>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <img src="/logo.svg" alt="Logo" className="mb-4 mx-auto" />
              <DialogTitle className="text-lg font-bold text-center">
                Sign in With Google
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 text-center">
                Sign in to the App with Google Authentication Security
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => login()}>
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Header;
