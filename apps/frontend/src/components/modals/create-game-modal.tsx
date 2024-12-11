import { type CreateGamePayload } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";

import CreateGameForm from "@/components/form/create-game-form";
import FullModal from "@/components/modals/full-modal";
import { createGameInitalValues, createGameSchema } from "@/forms/create-game-schema";
import { useCreateGameMutation } from "@/services/game";

interface CreateGameModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateGameModal({ isVisible, onClose }: CreateGameModalProps) {

  const [ createGame ] = useCreateGameMutation();

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
    </FullModal>
  );
}