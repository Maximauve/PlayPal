import { type ApiError, type CreateGamePayload } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { toast, type ToastContent } from "react-toastify";

import CreateGameForm from "@/components/form/create-game-form";
import FullModal from "@/components/modals/full-modal";
import { createGameInitalValues, createGameSchema } from "@/forms/create-game-schema";
import useTranslation from "@/hooks/use-translation";
import { useCreateGameMutation } from "@/services/game";

interface CreateGameModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateGameModal({ isVisible, onClose }: CreateGameModalProps) {

  const [ createGame ] = useCreateGameMutation();
  const i18n = useTranslation();

  const handleSubmit = async (values: CreateGamePayload) => {
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
        await createGame(formData).unwrap();
        toast.success(i18n.t("notify.create.game.success") as ToastContent<string>, {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error((error as ApiError)?.data?.message as ToastContent<string>, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      onClose();
    } catch (error) {
      toast.error((error as ApiError)?.data?.message as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formik = useFormik<CreateGamePayload>({
    initialValues: createGameInitalValues,
    validate: withZodSchema(createGameSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: false,
  });

  return (
    <FullModal isVisible={isVisible} onClose={onClose} title="admin.game.add">
      <CreateGameForm formik={formik}/>
    </FullModal>
  );
}