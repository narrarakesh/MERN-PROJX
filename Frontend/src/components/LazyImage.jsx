import React from 'react';
import UI_img from './../assets/UI_Img.webp';

const LazyImage = () => {
  return (
    <img
      src={UI_img}
      alt="UI Illustration"
      className="w-64 lg:w-[90%]"
      loading="lazy"
    />
  );
};

export default LazyImage;
