import { type CreateGamePayload } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";

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
      } catch (error) {
        console.error('Erreur lors de la création du jeu:', error);
      }
      onClose();
    } catch (error) {
      console.error('Failed to create game:', error);
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
      <div className="w-full flex justify-center items-center mt-4">
        <button className="rounded-md bg-blue-600 py-1 px-3 text-white hover:scale-105 active:scale-100 disabled:bg-gray-500 flex flex-row gap-2"
          disabled={formik.isSubmitting}
          type="button"
          onClick={() => formik.handleSubmit()}
        >
          {i18n.t("admin.game.sumbit")}
        </button>
      </div>
    </FullModal>
  );
}