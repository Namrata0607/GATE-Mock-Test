import React from 'react';

const ScientificCalculator = () => {
  return (
    <div className="relative w-full pb-[75%]">
        <iframe
            src="https://scientificalculatoronline.netlify.app/"
            className="absolute top-0 left-0 w-full h-full"
            title="Scientific Calculator"
        ></iframe>
    </div>
  );
};

export default ScientificCalculator;
