import { type RegisterDto } from '@playpal/schemas';
import { type useFormik } from 'formik';
import React, { useCallback } from 'react';

import FileInput from '@/components/form/file-input';
import TextInput from '@/components/form/text-input';
import { type WordingKey } from '@/context/i18n/i18n-service';

interface Props {
  formik: ReturnType<typeof useFormik<RegisterDto>>;
}

export default function RegisterForm({ formik }: Props): React.JSX.Element {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
    }
  };

  const handleChange = useCallback((field: string, value: string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);

  return (
    <div className='flex flex-col gap-2'>
      <TextInput name='username' label='auth.username' value={formik.values.username} required onChange={(e) => handleChange('username', e.target.value)} error={{ isError: !!formik.touched.username && !!formik.errors.username, message: formik.errors.username as WordingKey }} />
      <TextInput name='email' type='email' label='auth.email' required value={formik.values.email} onChange={(e) => handleChange('email', e.target.value)} error={{ isError: !!formik.touched.email && !!formik.errors.email, message: formik.errors.email as WordingKey }} />
      <TextInput name='password' type='password' label='auth.password' required value={formik.values.password} onChange={(e) => handleChange('password', e.target.value)} error={{ isError: !!formik.touched.password && !!formik.errors.password, message: formik.errors.password as WordingKey }} />
      <TextInput name='confirmPassword' type='password' label='auth.confirmPassword' required value={formik.values.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} error={{ isError: !!formik.touched.confirmPassword && !!formik.errors.confirmPassword, message: formik.errors.confirmPassword as WordingKey }} />
      <FileInput name="image" handleFileChange={handleFileChange} error={{ isError: !!formik.touched.image && !!formik.errors.image, message: formik.errors.image as WordingKey }}/>
    </div>
  );
}
