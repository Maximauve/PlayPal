import { type ProductDto } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { toast, type ToastContent } from "react-toastify";

import FullModal from "@/components/modals/full-modal";
import { createProductInitalValues, createProductSchema } from "@/forms/create-product-schema";
import useTranslation from "@/hooks/use-translation";
import { useCreateProductMutation } from "@/services/product";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ isVisible, onClose }: Props) {

  const [ createProduct ] = useCreateProductMutation();
  const i18n = useTranslation();

  const handleSubmit = async (values: ProductDto) => {
    try {
      await createProduct(values).unwrap();
      toast.success(i18n.t("notify.create.game.success") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Erreur lors de la création du jeu:', error);
      toast.error(i18n.t("notify.create.game.error") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    onClose();
  };

  const formik = useFormik<ProductDto>({
    initialValues: createProductInitalValues,
    validate: withZodSchema(createProductSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: false,
  });

  console.log(formik);

  return (
    <FullModal isVisible={isVisible} onClose={onClose} title="admin.game.add">
    </FullModal>
  );
}
