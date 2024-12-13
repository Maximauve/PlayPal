import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import useTranslation from "@/hooks/use-translation";

export default function Footer(): React.JSX.Element {
  const i18n = useTranslation();
  return (
    <footer className="w-full flex flex-col justify-center bg-stone-800 p-2 text-neutral-100">
      <div className="w-full flex flex-col justify-center items-center pt-2">
        <div className="w-full h-full flex justify-center items-center mb-4">
          <div className="w-full">
            <div className="flex justify-center font-bold">
              <div className="p-4">{i18n.t('common.about').toUpperCase()}</div>
              <div className="p-4">{i18n.t('common.search').toUpperCase()}</div>
              <div className="p-4">{i18n.t('common.contact').toUpperCase()}</div>
            </div>
          </div>
          <div className="px-4 w-2/5 flex flex-col text-center">
            <div className="text-white text-lg font-bold">{i18n.t('home.title').toUpperCase()}</div>
            <div className="text-neutral-700 text-xs">{i18n.t('home.subtitle')}</div>
          </div>
          <div className="w-full">
            <div className="flex justify-center text-xs">
              <div className="p-4">{i18n.t('auth.login.submit').toUpperCase()}</div>
              <div className="p-4">{i18n.t('auth.register.createAccount').toUpperCase()}</div>
              <div className="pl-8 flex justify-center items-center">
                <div className="px-2"> <FontAwesomeIcon icon={faAddressBook} className="text-2xl" /> </div>
                <div className="px-2"> // </div>
                <div className="px-2"> // </div>
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-center items-center w-full text-xs text-neutral-700 mb-8">
          <div className="">{i18n.t('copyright.message')}</div>
          <div className="w-3/5 border h-0 border-neutral-700 mx-3"></div>
          <div className="">{i18n.t('copyright.love')}</div>
        </div>
      </div>
    </footer>
  );
}
