import { type Tag as TagType } from "@playpal/schemas";
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

import { AllCards } from "@/components/all-cards";
import Carousel from '@/components/carousel';
import { TagsFilter } from '@/components/tags-filter';
import useTranslation from '@/hooks/use-translation';
import { useGetLastQuery, useGetRecommendationsQuery } from "@/services/game";

export default function HomePage(): React.JSX.Element {
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const { data: lastGames } = useGetLastQuery();
  const navigate = useNavigate(); 
  const i18n = useTranslation();

  useEffect(() => {
    document.title = "Playpal - Accueil";
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      return;
    }
    navigate(`/search`, { state: { tags: selectedTags } });
  }, [selectedTags]);

  const { data: gamesData } = useGetRecommendationsQuery(4);

  return (
    <Fragment>
      <h1 className="text-3xl font-bold text-center text-black my-4">{i18n.t('home.catchphrase')} </h1>
      <Carousel games={lastGames}/>

      <div className="w-full flex flex-col px-12 items-start bg-stone-300 mt-12">
        <h2 className="text-xl font-bold text-center text-black my-4">{i18n.t('home.tagSearch')}</h2>
        <TagsFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      </div>

      <div className="w-full flex flex-col px-12 mb-12 items-start">
        <h2 className="text-xl font-bold text-center text-black underline decoration-red-700 decoration-5 my-4">{i18n.t('home.recommendations')}</h2>
        <AllCards games={gamesData} />
        <div className="w-full flex px-32 justify-center mt-4">
          <NavLink to="/search" className="text-xl px-12 text-center bg-black font-bold text-white rounded-md py-2"> <span>{i18n.t('home.allGames')}</span></NavLink>
        </div>
      </div>
    </Fragment>
  );
}
