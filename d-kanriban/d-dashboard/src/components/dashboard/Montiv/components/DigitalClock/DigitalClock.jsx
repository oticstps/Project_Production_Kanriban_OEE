import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const optionsDate = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formattedDate = currentTime.toLocaleDateString('id-ID', optionsDate);

  return (
    <div className="text-center">
      <p className="text-xs text-gray-600">{formattedDate}</p>
      <p className="text-lg font-bold text-green-600">{currentTime.toLocaleTimeString('id-ID')}</p>
    </div>
  );
};

export default DigitalClock;