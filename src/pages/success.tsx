import React from "react";
import { useRouter } from "next/router";
import { Meteors } from "../components/meteorAnimation";

const SuccessPage = () => {
  const router = useRouter();
  const { message } = router.query as { message?: string };

  return (
    <div className="relative w-full h-screen bg-black flex flex-col justify-center items-center">
      {/* Meteor animation */}
      <div className="absolute inset-0 z-0">
        <Meteors number={50} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-9xl font-extrabold mb-8">
          {message || "Success!"}
        </h1>

        { !message && (
          <p className="text-gray-400 text-xl mb-8">
            Entry found
          </p>
        ) }
        
        {/* Spacer between message and gif */}
        <div className="mb-8"></div>
        
        {/* Success GIF */}
        <div className="w-full flex justify-center">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2todWN1bzZlN253dDRiMmhobXg3ZmVuMDNzaGkyZDlsemgzZ3I2MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/AcfTF7tyikWyroP0x7/giphy.gif"
            alt="Success celebration"
            className="w-64 h-64 sm:w-96 sm:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
