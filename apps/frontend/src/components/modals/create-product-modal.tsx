import { type ApiError, type ProductDto } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { toast, type ToastContent } from "react-toastify";

import CreateProductForm from "@/components/form/create-product-form";
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
      toast.success(i18n.t("notify.create.product.success") as ToastContent<string>, {
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
  };

  const formik = useFormik<ProductDto>({
    initialValues: createProductInitalValues,
    validate: withZodSchema(createProductSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: false,
  });

  return (
    <FullModal isVisible={isVisible} onClose={onClose} title="admin.game.add">
      <div className="w-full">
        <CreateProductForm formik={formik}/>
      </div>
    </FullModal>
  );
}
