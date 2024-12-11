import { faCakeCandles, faClock, faFireFlameCurved, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type RatingDto } from '@playpal/schemas';
import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Datepicker, { type DateValueType } from 'react-tailwindcss-datepicker';

import Breadcrumb, { type BreadcrumbItem } from '@/components/breadcrumb';
import ReviewForm from '@/components/form/review-form';
import { Rating } from '@/components/rating';
import { Review } from '@/components/review';
import { type TabProperties } from '@/components/tabs';
import { Tabs } from '@/components/tabs';
import { reviewInitialValues, reviewSchema } from '@/forms/review-schema';
import useTranslation from '@/hooks/use-translation';
import { useGetGameQuery } from '@/services/game';
import { useAddRatingMutation, useGetRatingsQuery } from '@/services/rating';

export default function GamePage(): React.JSX.Element {
  const [tabsItems, setTabsItems] = useState<TabProperties[]>([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [locDate, setLocDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const id = useParams<{ id: string }>() as { id: string };
  const { data: game, isLoading } = useGetGameQuery(id.id);
  const { data: ratings, refetch } = useGetRatingsQuery({ gameId: id.id });
  const [addRating] = useAddRatingMutation();
  const navigate = useNavigate();
  const i18n = useTranslation();

  const formik = useFormik<RatingDto>({
    initialValues: {
      note: reviewInitialValues.note,
      comment: reviewInitialValues.comment,
    },
    validate: withZodSchema(reviewSchema),
    onSubmit: async (values) => {
      try {
        await addRating({ gameId: id.id, body: values }).unwrap();
        formik.resetForm();
        refetch(); // Rafraîchir les évaluations après submit réussie
      } catch (error) {
        console.error("Add rating", error);
      }
    },
    validateOnChange: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isLoading && game) {
      setBreadcrumbItems([
        { label: 'Home', isActive: false, onClick: () => navigate('/') },
        { label: 'Products', isActive: false, onClick: () => navigate('/search') },
        { label: game.name, isActive: true },
      ]);

      setTabsItems([
        { label: "Description", content: game.description, isActive: true },
        ...(game.rules ? game.rules.map((rule) => ({ label: rule.title || '', content: rule.description || '', ytbLink: rule.youtubeId })) : []),
      ]);
    }
  }, [game, isLoading, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
              src={game?.image}
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

            <div className='flex flex-col '>
              <div className="flex items-center text-gray-500 text-sm mt-4">
                <FontAwesomeIcon icon={faUserGroup} className="text-black mr-2" />
                <p>De {game?.minPlayers} à {game?.maxPlayers} personnes</p>
                <FontAwesomeIcon icon={faClock} className="text-black mr-2 ml-3" />
                <p>{game?.duration}</p>
                <FontAwesomeIcon icon={faFireFlameCurved} className="text-black mr-2 ml-3" />
                <p>Difficulté {game?.difficulty}/5</p>
              </div>
              <div className="flex items-center text-gray-500 text-sm mt-2">
                <FontAwesomeIcon icon={faCakeCandles} className="text-black mr-2" />
                <p>{game?.minYear} ans et plus</p>
              </div>
            </div>

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
            <button className="bg-black text-white px-6 py-2 rounded mb-4 w-full hover:bg-gray-800">
              {i18n.t('game.details.addToRental')}
            </button>
            <div className="flex items-center justify-evenly text-sm text-gray-500">
              <button className="flex hover:underline items-center">
                <span className="mr-1">🔗</span> {i18n.t('game.details.share')}
              </button>
              <span className="text-gray-400 font-bold">|</span>
              <button className="flex hover:underline items-center">
                <span className="mr-1">❤️</span> {i18n.t('game.details.wishlist')}
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
            <div className='flex flex-col gap-4 mb-5 p-5 border border-gray-400 rounded-md'>
              <h2 className='text-lg font-bold'>{i18n.t('review.addReview')}</h2>
              <ReviewForm formik={formik}/>
              <button
                className='btn-primary bg-black text-white w-full rounded-md text-lg hover:scale-105 active:scale-100 disabled:bg-gray-50 px-3 py-1'
                type="button"
                disabled={formik.isSubmitting}
                onClick={() => formik.handleSubmit()}>
                {i18n.t("review.submit")}
              </button>
            </div>
            {ratings && (
              ratings.map((rating, index) => (
                <div key={index}>
                  <Review rating={rating} />
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