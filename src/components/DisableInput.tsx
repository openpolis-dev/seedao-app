import React, { useEffect } from 'react';

const DisableNumberInputWheel = () => {
  const handleWheel = (e:any) => {
    e.preventDefault();
  };

  useEffect(() => {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
      input.addEventListener('wheel', handleWheel);
    });

    return () => {
      numberInputs.forEach(input => {
        input.removeEventListener('wheel', handleWheel);
      });
    };
  }, []);

  return null;
};

export default DisableNumberInputWheel;
