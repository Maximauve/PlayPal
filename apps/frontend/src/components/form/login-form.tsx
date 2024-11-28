import { type LoginDto } from '@playpal/schemas';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Throw an error on type formik in props otherwise
import { useFormik } from 'formik';
import React, { useCallback } from 'react';

import TextInput from '@/components/form/text-input';
import { type WordingKey } from '@/context/i18n/i18n-service';

interface Props {
  formik: ReturnType<typeof useFormik<LoginDto>>;
}

export default function LoginForm({ formik }: Props): React.JSX.Element {

  const handleChange = useCallback((field: string, value: string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <div className='flex flex-col gap-2'>
      <TextInput name='email' type='email' label='auth.email' onChange={(e) => handleChange('email', e.target.value)} error={{ isError: !!formik.touched.email && !!formik.errors.email, message: formik.errors.email as WordingKey }} />
      <TextInput name='password' type='password' label='auth.password' onChange={(e) => handleChange('password', e.target.value)} error={{ isError: !!formik.touched.password && !!formik.errors.password, message: formik.errors.password as WordingKey }} />
    </div>
  );
}
