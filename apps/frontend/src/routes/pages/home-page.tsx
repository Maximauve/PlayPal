import { type Tag as TagType } from "@playpal/schemas";
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

import { AllCards } from "@/components/all-cards";
import Carousel from '@/components/carousel';
import { TagsFilter } from '@/components/tags-filter';
import { useGetGamesQuery } from "@/services/game";
// import useTranslation from '@/hooks/use-translation';

export default function HomePage(): React.JSX.Element {
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    document.title = "Playpal - Accueil";
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      return;
    }
    navigate(`/search`, { state: { tags: selectedTags } });
  }, [selectedTags]);

  const { data: gamesData } = useGetGamesQuery({
    tags: selectedTags,
    page: 1,
    limit: 4
  });



  // const i18n = useTranslation();
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-black my-4"> Jouez plus, dépensez moins avec Playpal !</h1>
      <Carousel />

      <div className="w-full flex flex-col px-32 items-start bg-stone-300 mt-12">
        <h2 className="text-xl font-bold text-center text-black my-4">Rechercher par catégorie</h2>
        <TagsFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      </div>

      <div className="w-full flex flex-col px-32 mb-12 items-start">
        <h2 className="text-xl font-bold text-center text-black underline decoration-red-700 decoration-5 my-4">Recommendations</h2>
        <AllCards games={gamesData} />
        <div className="w-full flex px-32 items-end mt-4">
          <NavLink to="/search" className="text-xs  p-1 px-12 font-bold text-center bg-black ">Tout nos jeux -&gt;</NavLink>
        </div>
      </div>


    </>
  );
}
