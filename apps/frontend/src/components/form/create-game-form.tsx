import { type CreateGamePayload } from "@playpal/schemas";
import { type useFormik } from "formik";
import React, { useCallback, useState } from "react";
import { Fragment } from "react/jsx-runtime";

import FileInput from "@/components/form/file-input";
import NumberInput from "@/components/form/number-input";
import SelectInput from "@/components/form/select-input";
import TextInput from "@/components/form/text-input";
import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";
import { useGetTagsQuery } from "@/services/tag";

interface CreateGameFormProps {
  formik: ReturnType<typeof useFormik<CreateGamePayload>>;
}

export default function CreateGameForm({ formik }: CreateGameFormProps) {

  const { data: tags } = useGetTagsQuery();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const i18n = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      formik.setFieldValue('image', file);
    }
  };

  const handleSelectionChange = (newValues: string[]) => {
    const updatedValues = selectedTags.reduce((accumulator, value) => {
      return accumulator.includes(value)
        ? accumulator.filter((existingValue) => existingValue !== value)
        : [...accumulator, value];
    }, newValues);
    setSelectedTags(updatedValues);
    formik.setFieldValue("tagIds", newValues);
    formik.setFieldTouched("tagIds", true);
  };

  const handleStringChange = useCallback((field: string, value: string[] | string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  const handleNumberChange = useCallback((field: string, value: number) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <Fragment>
      <TextInput name='name' type='text' label='admin.create.game.name' onChange={(e) => handleStringChange('name', e.target.value)} error={{ isError: !!formik.touched.name && !!formik.errors.name, message: formik.errors.name as WordingKey }} />
      <TextInput name='description' type='text' label='admin.create.game.description' onChange={(e) => handleStringChange('description', e.target.value)} error={{ isError: !!formik.touched.description && !!formik.errors.description, message: formik.errors.description as WordingKey }} />
      <NumberInput name='minPlayers' value={formik.values.minPlayers ?? undefined} min={1} max={99} label='admin.create.game.minPlayers' onChange={(e) => handleNumberChange('minPlayers', Number.parseInt(e.target.value, 10))} error={{ isError: !!formik.touched.minPlayers && !!formik.errors.minPlayers, message: formik.errors.minPlayers as WordingKey }} />
      <NumberInput name='maxPlayers' value={formik.values.maxPlayers ?? undefined} min={1} max={99} label='admin.create.game.maxPlayers' onChange={(e) => handleNumberChange('maxPlayers', Number.parseInt(e.target.value, 10))} error={{ isError: !!formik.touched.maxPlayers && !!formik.errors.maxPlayers, message: formik.errors.maxPlayers as WordingKey }} />
      <NumberInput name='difficulty' value={formik.values.difficulty ?? undefined} min={1} max={5} label='admin.create.game.difficulty' onChange={(e) => handleNumberChange('difficulty', Number.parseInt(e.target.value, 10))} error={{ isError: !!formik.touched.difficulty && !!formik.errors.difficulty, message: formik.errors.difficulty as WordingKey }} />
      <NumberInput name='minYear' value={formik.values.minPlayers ?? undefined} min={3} max={99} label='admin.create.game.minYear' onChange={(e) => handleNumberChange('minYear', Number.parseInt(e.target.value, 10))} error={{ isError: !!formik.touched.minYear && !!formik.errors.minYear, message: formik.errors.minYear as WordingKey }} />
      <TextInput name='duration' type='text' label='admin.create.game.duration' onChange={(e) => handleStringChange('duration', e.target.value)} error={{ isError: !!formik.touched.duration && !!formik.errors.duration, message: formik.errors.duration as WordingKey }} />
      <TextInput name='brand' type='text' label='admin.create.game.brand' onChange={(e) => handleStringChange('brand', e.target.value)} error={{ isError: !!formik.touched.brand && !!formik.errors.brand, message: formik.errors.brand as WordingKey }} />
      <SelectInput
        id="tags"
        name="tags"
        label="Tags"
        options={
          tags?.map((tag) => ({
            value: tag.id,
            label: tag.name,
          })) || []
        }
        value={selectedTags}
        onChange={handleSelectionChange}
        error={{
          isError: !!formik.touched.tagIds && !!formik.errors.tagIds,
          message: formik.errors.tagIds as WordingKey,
        }}
      />
      <FileInput name="image" handleFileChange={handleFileChange} formik={formik}/>
      <div className="w-full flex justify-center items-center mt-4">
        <button className="rounded-md bg-blue-600 py-1 px-3 text-white hover:scale-105 active:scale-100 disabled:bg-gray-500 flex flex-row gap-2"
          disabled={formik.isSubmitting}
          type="button"
          onClick={() => formik.handleSubmit()}
        >
          {i18n.t("admin.game.sumbit")}
        </button>
      </div>
    </Fragment>
  );
}