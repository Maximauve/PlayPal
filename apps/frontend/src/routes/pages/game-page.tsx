import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Datepicker, { type DateValueType } from 'react-tailwindcss-datepicker';

import Breadcrumb, { type BreadcrumbItem } from '@/components/breadcrumb';
import { Rating } from '@/components/rating';
import { Review } from '@/components/review';
import { type TabProperties } from '@/components/tabs';
import { Tabs } from '@/components/tabs';
import useTranslation from '@/hooks/use-translation';
import { useGetGameQuery } from '@/services/game';

export default function GamePage(): React.JSX.Element {
  const [tabsItems, setTabsItems] = useState<TabProperties[]>([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const id = useParams<{ id: string }>() as { id: string };
  const { data: game, isLoading } = useGetGameQuery(id.id);

  const [locDate, setLocDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  // if isLoading is false and game is ok, load the breadcrumb and tabs
  useEffect(() => {
    if (!isLoading && game) {
      setBreadcrumbItems([
        { label: 'Home', isActive: false, onClick: () => console.log('Home') },
        { label: 'Products', isActive: false, onClick: () => console.log('Products') },
        { label: game.name },
      ]);

      setTabsItems([
        { label: "Description", content: game.description, isActive: true },
        ...(game.rules ? game.rules.map((rule) => ({ label: rule.title || '', content: rule.description || '' })) : []),
      ]);
    }
  }, [game, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const i18n = useTranslation();
  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-500">
          <Breadcrumb items={breadcrumbItems} separator=">" />
        </nav>

        <div className="flex flex-wrap">
          {/* Product Image */}
          <div className="w-full md:w-1/2 p-2">
            <img
              src="https://placehold.co/400x400?text=UNO"
              alt="Product"
              className="rounded-lg shadow-md"
            />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 p-2">
            <h1 className="text-2xl font-bold">{game?.name}</h1>
            <p className="text-gray-500 mb-2">By {game?.brand}</p>

            {/* Rating */}
            <Rating rating={3.4} nbRatings={game?.rating?.length} />

            {/* Availability */}
            <div className="mt-6 mb-4">
              {/* if at least one product is available */}
              {game?.product?.some((product) => product.available) ? (
                <span className="bg-green-700 text-white px-2 py-1 rounded">
                  {i18n.t('card.inStock')}
                </span>
              ) : (
                <span className="bg-red-600 text-white px-2 py-1 rounded">
                  {i18n.t('card.notStock')}
                </span>
              )}
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <Datepicker
                value={locDate}
                onChange={setLocDate}
                inputClassName={"w-full p-2 border border-gray-300 rounded"}
              />
            </div>

            {/* Action Buttons */}
            <button className="bg-black text-white px-6 py-2 rounded mb-4 w-full">
              Rent this game
            </button>
            <div className="flex items-center justify-evenly text-sm text-gray-500">
              <button className="flex items-center">
                <span className="mr-1">🔗</span> Share
              </button>
              <span className="text-gray-400 font-bold">|</span>
              <button className="flex items-center">
                <span className="mr-1">❤️</span> Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-200" />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 p-2">
            <Tabs tabs={tabsItems} classes='bg-gray-200 w-full p-2 rounded-md text-sm' />
          </div>
          <div className="w-full md:w-1/2 p-2">
            {game?.rating && (
              game.rating.map((rating, index) => (
                <div>
                  <Review key={index} rating={rating} />
                  <hr className='my-3'/>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
