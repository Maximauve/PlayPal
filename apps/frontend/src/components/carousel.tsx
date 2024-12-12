

import { type Game } from '@playpal/schemas';
import { useEffect, useState } from 'react';

import AllGames from '@/assets/images/all-games.png';

interface CarouselProps {
  games?: Game[]
}

interface CarouselGame {
  alt: string
  title: string
  image?: string
}

export default function Carousel({ games }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselGames, setCarouselGames] = useState<CarouselGame[] | null>(null);

  useEffect(() => {
    if (games) {
      const newGames: CarouselGame[] = games.map(game => ({ 
        image: game.image,
        title: game.name,
        alt: game.name,
      }));
      setCarouselGames(newGames);
    }
  }, [games]);

  const nextSlide = () => {
    if (!carouselGames) {
      return null;
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselGames.length);
  };

  const prevSlide = () => {
    if (!carouselGames) {
      return null;
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselGames.length) % carouselGames.length);
  };

  if (!carouselGames) {
    return null;
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative h-96 overflow-hidden rounded-lg">
        {carouselGames && carouselGames?.map((gameCarousel: CarouselGame, index: number) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={gameCarousel.image ?? AllGames}
              alt={gameCarousel.alt}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <p>{gameCarousel.title}</p>
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

