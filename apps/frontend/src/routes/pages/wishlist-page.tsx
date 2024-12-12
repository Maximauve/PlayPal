import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import WishList from "@/components/wish-list";
import useAuth from "@/hooks/use-auth";
import useTranslation from "@/hooks/use-translation";

export default function WishlistPage() {
  const i18n = useTranslation();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() =>  {
    if (!user?.loading && !user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="w-full min-h-full px-12">
      <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl text-center py-4">
        {i18n.t("wishlist.title")}
      </h1>
      <div>
        <h3 className="text-xl font-bold text-black underline decoration-red-700 decoration-5 my-4">Mes articles</h3>
        <WishList />
      </div>
    </div>
  );
}