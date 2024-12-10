import { type CreateGamePayload } from "@playpal/schemas";
import { type useFormik } from "formik";
import { useCallback } from "react";
import { Fragment } from "react/jsx-runtime";

import Select from "@/components/form/select";
import TextInput from "@/components/form/text-input";
import { type WordingKey } from "@/context/i18n/i18n-service";
import { useGetTagsQuery } from "@/services/tag";

interface CreateGameFormProps {
  formik: ReturnType<typeof useFormik<CreateGamePayload>>;
}

export default function CreateGameForm({ formik }: CreateGameFormProps) {

  const { data: tags } = useGetTagsQuery();

  const handleChange = useCallback((field: string, value: string[] | string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <Fragment>
      <TextInput name='title' type='text' label='admin.create.game.title' onChange={(e) => handleChange('title', e.target.value)} error={{ isError: !!formik.touched.name && !!formik.errors.name, message: formik.errors.name as WordingKey }} />
      <TextInput name='description' type='text' label='admin.create.game.description' onChange={(e) => handleChange('description', e.target.value)} error={{ isError: !!formik.touched.description && !!formik.errors.description, message: formik.errors.description as WordingKey }} />
      <TextInput name='minPlayers' type='number' label='admin.create.game.minPlayers' onChange={(e) => handleChange('minPlayers', e.target.value)} error={{ isError: !!formik.touched.minPlayers && !!formik.errors.minPlayers, message: formik.errors.minPlayers as WordingKey }} />
      <TextInput name='maxPlayers' type='number' label='admin.create.game.maxPlayers' onChange={(e) => handleChange('maxPlayers', e.target.value)} error={{ isError: !!formik.touched.maxPlayers && !!formik.errors.maxPlayers, message: formik.errors.maxPlayers as WordingKey }} />
      <TextInput name='difficulty' type='number' label='admin.create.game.difficulty' onChange={(e) => handleChange('difficulty', e.target.value)} error={{ isError: !!formik.touched.difficulty && !!formik.errors.difficulty, message: formik.errors.difficulty as WordingKey }} />
      <TextInput name='minYear' type='number' label='admin.create.game.minYear' onChange={(e) => handleChange('minYear', e.target.value)} error={{ isError: !!formik.touched.minYear && !!formik.errors.minYear, message: formik.errors.minYear as WordingKey }} />
      <TextInput name='duration' type='text' label='admin.create.game.duration' onChange={(e) => handleChange('duration', e.target.value)} error={{ isError: !!formik.touched.duration && !!formik.errors.duration, message: formik.errors.duration as WordingKey }} />
      <Select
        id="tags"
        name="tags"
        label="Tags"
        options={
          tags?.map((tag) => ({
            value: tag.id,
            label: tag.name,
          })) || []
        }
        value={formik.values.tagsIds || []}
        onChange={(value) => formik.setFieldValue("tagsIds", value)}
        error={{
          isError: !!formik.touched.tagsIds && !!formik.errors.tagsIds,
          message: formik.errors.tagsIds as WordingKey,
        }}
      />
    </Fragment>
  );
}