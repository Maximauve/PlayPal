import { type TagPayload } from "@playpal/schemas";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { useCallback }  from "react";

import TextInput from "@/components/form/text-input";
import { type WordingKey } from "@/context/i18n/i18n-service";
import { createTagInitialValues, createTagSchema } from "@/forms/create-tag-schema";
import useTranslation from "@/hooks/use-translation";
import { useCreateTagMutation } from "@/services/tag";

export default function TagHeader() {
  const i18n = useTranslation();
  const [createTag] = useCreateTagMutation();

  const formik = useFormik<TagPayload>({
    initialValues: createTagInitialValues,
    validate: withZodSchema(createTagSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: false,
  });

  const handleSubmit = (values: TagPayload) => {
    try {
      createTag(values).unwrap();
      formik.resetForm({ values: createTagInitialValues });
    } catch (error) {
      console.error("Error create tag :", error);
    }
  };

  const handleChange = useCallback((field: string, value: string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 className="text-center text-2xl my-4">{i18n.t("admin.tag.title")}</h1>
      <TextInput value={formik.values.name} name='tag-name' type='text' onChange={(e) => handleChange('name', e.target.value)} error={{ isError: !!formik.touched.name && !!formik.errors.name, message: formik.errors.name as WordingKey }} />
      <div className="w-full flex justify-center items-center mt-4">
        <button className="rounded-md bg-blue-600 py-1 px-3 text-white hover:scale-105 active:scale-100 disabled:bg-gray-500 flex flex-row gap-2"
          disabled={formik.isSubmitting}
          type="submit"
        >
          {i18n.t("admin.tag.submit")}
        </button>
      </div>
    </form>
  );
}