import { type RatingDto } from '@playpal/schemas';
import { type useFormik } from 'formik';
import React, { useCallback } from 'react';

import NumberInput from '@/components/form/number-input';
import TextInput from '@/components/form/text-input';
import { type WordingKey } from '@/context/i18n/i18n-service';

interface Props {
  formik: ReturnType<typeof useFormik<RatingDto>>;
}

export default function ReviewForm({ formik }: Props): React.JSX.Element {
  // const formik = useFormik({
  //   initialValues: reviewInitialValues,
  //   validationSchema: reviewSchema,
  //   onSubmit,
  // });

  const handleChange = useCallback((field: string, value: string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  const handleNumberChange = useCallback((field: string, value: number) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <div className='flex flex-col gap-2'>
      {/* <NumberInput name='minPlayers' value={1} min={1} max={99} label='admin.create.game.minPlayers' onChange={(e) => handleNumberChange('minPlayers', Number.parseInt(e.target.value, 10))} error={{ isError: !!formik.touched.minPlayers && !!formik.errors.minPlayers, message: formik.errors.minPlayers as WordingKey }} /> */}
      <NumberInput
        name='note'
        label='review.rating'
        value={1}
        min={1}
        max={5}
        required
        onChange={(e) => handleNumberChange('note', Number.parseInt(e.target.value, 10))}
        error={{ isError: !!formik.touched.note && !!formik.errors.note, message: formik.errors.note as WordingKey }}
        classNameOverride='rounded-md text-black bg-white border disabled:bg-gray-500 w-full py-1 pl-2 border-gray-200 '
        placeholder={'review.notePlaceholder' as WordingKey}
      />
      <TextInput
        name='comment'
        label='review.comment'
        value={formik.values.comment}
        required
        onChange={(e) => handleChange('comment', e.target.value)}
        error={{ isError: !!formik.touched.comment && !!formik.errors.comment, message: formik.errors.comment as WordingKey }}
        classNameOverride='rounded-md text-black bg-white border disabled:bg-gray-500 w-full py-1 pl-2 border-gray-200 '
        placeholder={'review.commentPlaceholder' as WordingKey}
      />
    </div>
  );
}