import { type ProductDto, State } from "@playpal/schemas";
import { type useFormik } from "formik";

import SelectInput from "@/components/form/select-input";
import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";
import { useGetGamesQuery } from "@/services/game";

interface CreateProductFormProps {
  formik: ReturnType<typeof useFormik<ProductDto>>;
}

export default function CreateProductForm({ formik }: CreateProductFormProps) {

  const { data: games } = useGetGamesQuery({});
  const i18n = useTranslation();

  const handleSelectionChange = ((field: string, newValue: string) => {
    formik.setFieldValue(field, newValue);
    formik.setFieldTouched(field, true);
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <SelectInput
        id="gameId"
        name="gameId"
        label="admin.game.label"
        options={
          games?.data?.map((game) => ({
            value: game.id,
            label: game.name,
          })) || []
        }
        value={games?.data[0].id ?? ''}
        onChange={handleSelectionChange}
        error={{
          isError: !!formik.touched.gameId && !!formik.errors.gameId,
          message: formik.errors.gameId as WordingKey,
        }}
      />
      <SelectInput
        id="state"
        name="state"
        label="admin.state.label"
        options={
          Object.keys(State).map((state) => ({
            value: state,
            label: state,
          })) || []
        }
        value={State.NEW}
        onChange={handleSelectionChange}
        error={{
          isError: !!formik.touched.state && !!formik.errors.state,
          message: formik.errors.state as WordingKey,
        }}
      />
      <div className="w-full flex justify-center items-center mt-4">
        <button className="rounded-md bg-blue-600 py-1 px-3 text-white hover:scale-105 active:scale-100 disabled:bg-gray-500 flex flex-row gap-2"
          disabled={formik.isSubmitting}
          type="submit"
        >
          {i18n.t("admin.product.submit")}
        </button>
      </div>
    </form>
  );
}
