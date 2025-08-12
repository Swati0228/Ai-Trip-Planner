import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom'; // ✅ Use react-router-dom



function Hero() {
  return (
    <div
    className="w-screen h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center pt-20 px-4 md:px-0"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')"
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40 z-0" />
  
    {/* Content */}
    <div className="z-10 text-center max-w-4xl px-4 flex flex-col items-center gap-6">
      <h1 className="font-extrabold text-[32px] md:text-[45px] leading-tight">
        <span className="text-[#F87171] block">Discover Your Next Adventure with AI:</span>
        <span className="text-white block">
          Smarter itineraries. Zero hassle. Total adventure.
        </span>
      </h1>
  
      <p className="text-gray-200 text-lg max-w-xl">
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
  
      <Link to="/create-trip">
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out">
          Get Started, It's Free
        </Button>
      </Link>
    </div>
  </div>
  
  );
}

export default Hero;
