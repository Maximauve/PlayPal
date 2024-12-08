

import { useState } from 'react';

const images = [
  { src: 'https://picsum.photos/id/42/600/400', alt: 'Slide 1', comment: 'Beautiful landscape' },
  { src: 'https://picsum.photos/id/195/600/400', alt: 'Slide 2', comment: 'City skyline' },
  { src: 'https://picsum.photos/id/635/600/400', alt: 'Slide 3', comment: 'Mountain view' },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative h-96 overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <p>{image.comment}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-black font-bold hover:bg-opacity-75 rounded-lg border-slate-600 h-8 w-8 focus:outline-none"
        aria-label="Previous slide"
      >
        - 
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-black font-bold hover:bg-opacity-75 rounded-lg border-slate-600 h-8 w-8 focus:outline-none"
        aria-label="Next slide"
      >
        +
      </button>
    </div>
  );
}

