import { type UpdateGamePayload } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { toast, type ToastContent } from "react-toastify";

import UpdateGameForm from "@/components/form/update-game-form";
import FullModal from "@/components/modals/full-modal";
import { updateGameSchema } from "@/forms/update-game-schema";
import useTranslation from "@/hooks/use-translation";
import { useUpdateGameMutation } from "@/services/game";

interface EditGameModalProps {
  gameData: UpdateGamePayload;
  isVisible: boolean;
  onClose: () => void;
}

export default function EditGameModal({ isVisible, onClose, gameData }: EditGameModalProps) {
  const [updateGame] = useUpdateGameMutation();
  const i18n = useTranslation();

  const formik = useFormik<UpdateGamePayload>({
    initialValues: gameData,
    validationSchema: withZodSchema(updateGameSchema),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key !== 'image' && key !== "tagIds") {
            formData.append(key, String(value));
          }
        });
        if (Array.isArray(values.tagIds)) {
          values.tagIds.forEach((tagId: string) => {
            formData.append('tagsIds[]', tagId);
          });
        }
        if (values.image instanceof File) {
          formData.append('image', values.image as Blob);
        }
        try {
          await updateGame({ id: gameData.id, body: formData }).unwrap();
          toast.success(i18n.t("notify.update.game.success") as ToastContent<string>, {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (error: unknown) {
          console.error('Erreur lors de la mise à jour du jeu:', error);
          toast.error(i18n.t("notify.update.game.error") as ToastContent<string>, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error: unknown) {
        console.error('Erreur lors de la soumission du formulaire:', error);
        toast.error(i18n.t("notify.update.game.error") as ToastContent<string>, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <FullModal isVisible={isVisible} onClose={onClose}>
      <UpdateGameForm formik={formik} />
    </FullModal>
  );
}