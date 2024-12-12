import { type ApiError } from "@playpal/schemas";
import { toast, type ToastContent } from "react-toastify";

import { Card } from "@/components/cards/card";
import useTranslation from "@/hooks/use-translation";
import { useDeleteWishMutation, useGetAllWishByUserQuery } from "@/services/wish";

export default function WishList() {
  const { data: wishs } = useGetAllWishByUserQuery();
  const i18n = useTranslation();
  const [deleteWish] = useDeleteWishMutation();


  const onRemove = async (id: string) => {
    try {
      await deleteWish(id).unwrap();
      toast.success(i18n.t("notify.delete.wish.success") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: unknown) {
      toast.error((error as ApiError)?.data?.message as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      {wishs?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {wishs?.map((wish, index) => (
            <Card key={index} game={wish.game} onRemove={() => onRemove(wish.id)}/>
          ))}
        </div>
      ) : (
        <p className="text-center text-black text-lg my-6">{i18n.t("wishlist.empty.state")}</p>
      )}
    </div>
  );
}