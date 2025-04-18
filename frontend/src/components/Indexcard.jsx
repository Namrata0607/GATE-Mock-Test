import React from 'react';

const IndexCard = ({imgSrc, title, description }) => {
    return (
        <div className="relative h-50 w-90 gap-2 lg:w-95 lg:h-55 border-5 border-blue-100 bg-blue-200 shadow-xl rounded-xl flex flex-col items-center text-center p-4 transition-all duration-300 ease-in-out hover:scale-105">
          {/* Image */}
          <img
            src={imgSrc}
            alt={title}
            className="w-15 h-15 object-cover -mt-10"
          />
          
          {/* Title */}
          <h1 className="text-lg text-gray-800 font-bold mt-2 lg:text-xl lg:mt-4">{title}</h1>
    
          {/* Description */}
          <p className="text-gray-800 mt-3 lg:m-4">{description}</p>
        </div>
      );
};

export default IndexCard;