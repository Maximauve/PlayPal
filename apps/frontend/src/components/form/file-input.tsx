import { type CreateGamePayload } from "@playpal/schemas";
import { type useFormik } from "formik";
import React from "react";

import { type WordingKey } from "@/context/i18n/i18n-service";

interface FileInputProps {
  formik: ReturnType<typeof useFormik<CreateGamePayload>>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}


export default function FileInput({ name, handleFileChange, formik }: FileInputProps): React.JSX.Element {

  return (
    <div>
      <label htmlFor="image">Image</label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {formik.touched.image && formik.errors.image && (
        <div className="error">{formik.errors.image as WordingKey}</div>
      )}
    </div>
  );
}