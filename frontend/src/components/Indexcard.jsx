import React from 'react';

const IndexCard = ({imgSrc, title, description }) => {
    return (
        <div className="relative h-55 w-75 border-2 border-blue-100 bg-blue-200 shadow-xl rounded-2xl  flex flex-col items-center text-center p-4 m-4 transition-all duration-300 ease-in-out hover:scale-105">
          {/* Image */}
          <img
            src={imgSrc}
            alt={title}
            className="w-25 h-25 rounded-full object-cover  -mt-10"
          />
          
          {/* Title */}
          <h1 className="text-lg text-gray-800 font-bold mt-2">{title}</h1>
    
          {/* Description */}
          <p className="text-gray-800 text mt-3">{description}</p>
        </div>
      );
};

export default IndexCard;
