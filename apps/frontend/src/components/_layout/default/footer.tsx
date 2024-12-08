import React from "react";

export default function Footer(): React.JSX.Element {
  return (
    <footer className="w-full flex flex-col justify-center bg-stone-800 p-2 text-neutral-100">
      <div className="w-full flex flex-col justify-center items-center pt-2">
        <div className="w-full h-full flex justify-center items-center mb-4">
          <div className="w-full">
            <div className="flex justify-center font-bold">
              <div className="p-4">À PROPOS</div>
              <div className="p-4">RECHERCHER</div>
              <div className="p-4">CONTACT</div>
            </div>
          </div>
          <div className="px-4 w-2/5 flex flex-col text-center">
            <div className="text-white text-lg font-bold">PLAYPAL</div>
            <div className="text-neutral-700 text-xs">Some catchphrase</div>
          </div>
          <div className="w-full">
            <div className="flex justify-center text-xs">
              <div className="p-4">Connexion</div>
              <div className="p-4">Créer un compte</div>
              <div className="pl-8 flex justify-center items-center">
                <div className="px-2"> // </div>
                <div className="px-2"> // </div>
                <div className="px-2"> // </div>
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-center items-center w-full text-xs text-neutral-700 mb-8">
          <div className="">© 2024 Playpal. All rights reserved</div>
          <div className="w-3/5 border h-0 border-neutral-700 mx-3"></div>
          <div className="">Made with love</div>
        </div>
      </div>
    </footer>
  );
}
