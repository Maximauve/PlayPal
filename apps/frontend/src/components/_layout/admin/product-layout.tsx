import { Fragment, useEffect } from "react";

import AdminButton from '@/components/_layout/admin/admin-button';
import { ProductCard } from '@/components/cards/product.card';
import Loader from '@/components/loader';
import CreateProductModal from '@/components/modals/create-product-modal';
import useModal from '@/hooks/use-modal';
import useTranslation from '@/hooks/use-translation';
import { useGetProductsQuery } from '@/services/product';

export default function ProductLayout() {
  const i18n = useTranslation();

  const { isLoading, data: products } = useGetProductsQuery();
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    console.log(products);
  }, [products]);

  const onDelete = (id: string) => {
    console.log(id);
  };

  return (
    <Fragment>
      <div className='w-full flex flex-row justify-end'>
        <AdminButton onClick={openModal} className='py-2 px-8'>{i18n.t("admin.product.add")}</AdminButton>
      </div>
      <div className="col-[1/3] row-[2/3] bg-admin-background-light rounded-2xl shadow-admin h-full p-5 flex flex-col gap-3">
        { isLoading ? (
          <Loader />
        ) : products && products.length > 0 && products?.map(product => (
          <ProductCard product={product} onDelete={() => onDelete(product.id)}/>
        ))}
      </div>
      <CreateProductModal isVisible={isOpen} onClose={closeModal} />
    </Fragment>
  );
};
