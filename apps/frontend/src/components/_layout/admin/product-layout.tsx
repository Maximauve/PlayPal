import { type ApiError } from "@playpal/schemas";
import { Fragment } from "react";
import { toast, type ToastContent } from "react-toastify";

import AdminButton from '@/components/_layout/admin/admin-button';
import { ProductCard } from '@/components/cards/product.card';
import Loader from '@/components/loader';
import CreateProductModal from '@/components/modals/create-product-modal';
import useModal from '@/hooks/use-modal';
import useTranslation from '@/hooks/use-translation';
import { useDeleteProductMutation, useGetProductsQuery } from '@/services/product';

export default function ProductLayout() {
  const i18n = useTranslation();

  const { isLoading, data: products } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const { isOpen, openModal, closeModal } = useModal();

  const onDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success(i18n.t("admin.product.delete.success") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error((error as ApiError)?.data?.message as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Fragment>
      <div className='w-full flex flex-row justify-end'>
        <AdminButton onClick={openModal} className='py-2 px-8'>{i18n.t("admin.product.add")}</AdminButton>
      </div>
      <div className="col-[1/3] row-[2/3] bg-admin-background-light rounded-2xl shadow-admin h-full p-5 flex flex-col gap-3">
        { isLoading ? (
          <Loader />
        ) : products && products.length > 0 && products?.map((product, index) => (
          <ProductCard key={index} product={product} onDelete={() => onDelete(product.id)}/>
        ))}
      </div>
      <CreateProductModal isVisible={isOpen} onClose={closeModal} />
    </Fragment>
  );
};
