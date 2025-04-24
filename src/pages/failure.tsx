import React from 'react';
import { useRouter } from 'next/router';
import { Meteors } from '../components/meteorAnimation';

const FailedPage: React.FC = () => {
  const router = useRouter();
  const { message } = router.query as { message?: string };

  return (
    <div className="relative w-full h-screen bg-black flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0">
        <Meteors number={50} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-white text-9xl font-extrabold mb-8">
          {message || '404'}
        </h1>
        { !message && (
          <p className="text-white text-xl mb-8">Entry not found</p>
        ) }
        <div className="w-full flex justify-center mt-10">
          <img
            src="https://media.giphy.com/media/afVwAjxEfqofu/giphy.gif"
            alt="Entry not found"
            className="w-64 h-64 sm:w-96 sm:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default FailedPage;
