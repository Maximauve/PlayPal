import { type FC } from "react";

import { SearchBar } from "@/components/search-bar";
import useTranslation from "@/hooks/use-translation";

export const SearchHeader: FC = () => {
  const i18n = useTranslation();
  return (
    <header className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/50 px-4 py-16 text-center md:py-24">
      <div className="mx-auto max-w-2xl space-y-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {i18n.t("search.header.title")}
        </h1>
        <SearchBar />
      </div>
    </header>
  );
};