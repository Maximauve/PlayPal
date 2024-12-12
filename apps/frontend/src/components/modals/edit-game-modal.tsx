import { type EditGamePayload, type GameWithStats } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { toast, type ToastContent } from "react-toastify";

import EditGameForm from "@/components/form/edit-game-form";
import FullModal from "@/components/modals/full-modal";
import { editGameSchema } from "@/forms/edit-game-schema";
import useTranslation from "@/hooks/use-translation";
import { useUpdateGameMutation } from "@/services/game";

interface EditGameModalProps {
  gameData: GameWithStats;
  isVisible: boolean;
  onClose: () => void;
}

export default function EditGameModal({ isVisible, onClose, gameData }: EditGameModalProps) {

  const [ editGame ] = useUpdateGameMutation();
  const i18n = useTranslation();

  const handleSubmit = async (values: EditGamePayload) => {
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
        await editGame({ id: gameData.id, body: formData }).unwrap();
        toast.success(i18n.t("notify.update.game.success") as ToastContent<string>, {
          position: "top-right",
          autoClose: 3000,
        });
      } catch  {
        toast.error(i18n.t("notify.update.game.error") as ToastContent<string>, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      onClose();
    } catch {
      toast.error(i18n.t("notify.update.game.error") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formik = useFormik<EditGamePayload>({
    initialValues: {
      name: gameData.name,
      description: gameData.description,
      minPlayers: gameData.minPlayers,
      maxPlayers: gameData.maxPlayers,
      difficulty: gameData.difficulty,
      minYear: gameData.minYear,
      duration: gameData.duration,
      brand: gameData.brand,
      tagIds: gameData.tags.map((tag) => tag.id),
      image: gameData.image,
    },
    validate: withZodSchema(editGameSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: false,
  });

  return (
    <FullModal isVisible={isVisible} onClose={onClose} title="admin.game.edit">
      <EditGameForm formik={formik}/>
    </FullModal>
  );
}
