import React, { Fragment, useCallback } from "react";
import { NavLink } from "react-router-dom";

import DefaultProfile from "@/assets/images/default-profile-picture.jpg";
import AuthModal from "@/components/modals/auth-modal";
import Modal from "@/components/modals/modal";
import useAuth from "@/hooks/use-auth";
import useModal from "@/hooks/use-modal";
import useTranslation from "@/hooks/use-translation";
import { useLogoutMutation } from "@/services/auth";

export default function Navbar(): React.JSX.Element {
  const { isOpen, toggleModal, closeModal } = useModal();
  const { isOpen: loginModal, closeModal: closeLoginModal, openModal: openLoginModal } = useModal();
  const i18n = useTranslation();
  const [logout] = useLogoutMutation();

  const { user } = useAuth();
  const handleConnect = useCallback(() => {
    closeModal();
    openLoginModal();
  }, [openLoginModal, closeModal]);

  const handleLogout = useCallback(() => {
    closeModal();
    logout({});
  }, [logout]);
  
  return (
    <Fragment>
      <nav className="w-full flex flex-row justify-between bg-gray-400 px-4 py-2">
        <div className="flex items-center"> 
          <NavLink to="/" className="text-white text-3xl font-bold">Playpal</NavLink>
        </div>
        <div className="flex flex-row justify-end">
          <div className="cursor-pointer" onClick={toggleModal}>
            <img src={user?.image ?? DefaultProfile} className="w-12 h-12 rounded-full hover:scale-105 active:scale-100" />
          </div>
        </div>
      </nav>
      <Modal visible={isOpen} onClose={closeModal} title={user ? "account.greeting" : "account.account"} translateOptions={user ? { name: user.username } : undefined} classes="bg-white right-2 mt-2 text-black max-w-80 before:content-[' '] before:absolute before:top-[-0.25rem] before:right-6 before:w-3 before:h-3 before:rotate-45 before:bg-white">
        <div className="px-2 pb-3 gap-3 flex flex-col items-center justify-start">
          { user ? (
            <Fragment>
              <NavLink to="/user" className="bg-blue-600 font-bold text-white rounded-md px-4 py-2 w-full text-center">{i18n.t("account.account")}</NavLink>
              <button className="bg-blue-600 font-bold text-white rounded-md px-4 py-2 w-full text-center" onClick={handleLogout}>{i18n.t("account.logout")}</button>
            </Fragment>
          ) : (
            <Fragment>
              <p className="text-sm text-center">{i18n.t("account.pleaseConnect")}</p>
              <button className="bg-blue-600 font-bold text-white rounded-md px-4 py-2" onClick={handleConnect}>{i18n.t('account.connect')}</button>
            </Fragment>
          )}
        </div>
      </Modal>
      <AuthModal isVisible={loginModal} onClose={closeLoginModal}/>
    </Fragment>
  );
}
