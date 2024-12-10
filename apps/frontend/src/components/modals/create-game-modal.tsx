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

  const handleSubmit = (values: CreateGamePayload) => {
    createGame(values).then(({ error }) => {
      if (error) {
        console.error("Login", error);
        throw new Error("Login failed");
      }
      return;
    }).catch((error) => {
      console.error(error);
    });
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