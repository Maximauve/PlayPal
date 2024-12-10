import { useFormik } from 'formik';
import React, { useCallback } from 'react';

import TextInput from '@/components/form/text-input';
import { type WordingKey } from '@/context/i18n/i18n-service';
import { reviewInitialValues, reviewSchema } from '@/forms/review-schema';

interface Props {
  onSubmit: (values: typeof reviewInitialValues) => void;
}

export default function ReviewForm({ onSubmit }: Props): React.JSX.Element {
  const formik = useFormik({
    initialValues: reviewInitialValues,
    validationSchema: reviewSchema,
    onSubmit,
  });

  const handleChange = useCallback((field: string, value: string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <form onSubmit={formik.handleSubmit} className='flex flex-col gap-2'>
      <TextInput
        name='rating'
        label='review.rating'
        type='text'
        value={formik.values.rating.toString()}
        required
        onChange={(e) => handleChange('rating', e.target.value)}
        error={{ isError: !!formik.touched.rating && !!formik.errors.rating, message: formik.errors.rating as WordingKey }}
      />
      <TextInput
        name='comment'
        label='review.comment'
        value={formik.values.comment}
        required
        onChange={(e) => handleChange('comment', e.target.value)}
        error={{ isError: !!formik.touched.comment && !!formik.errors.comment, message: formik.errors.comment as WordingKey }}
      />
      <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
        Submit Review
      </button>
    </form>
  );
}