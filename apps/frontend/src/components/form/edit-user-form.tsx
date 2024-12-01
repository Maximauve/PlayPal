import { type RegisterDto } from '@playpal/schemas';
import { type useFormik } from 'formik';
import React, { useCallback } from 'react';

// import FileInput from '@/components/form/file-input';
import TextInput from '@/components/form/text-input';
import { type WordingKey } from '@/context/i18n/i18n-service';

interface Props {
  formik: ReturnType<typeof useFormik<Partial<RegisterDto>>>;
}


export default function EditUserForm( { formik }: Props): React.JSX.Element {

  // const handleFileChange = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.addEventListener('load', (e) => {
  //       console.log(e.target);
  //       formik.setFieldValue(field, e.target?.result as string);
  //       formik.setFieldTouched(field, true);
  //     });
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleChange = useCallback((field: string, value: string) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  }, [formik]);


  return (
    <div className='flex flex-col gap-2'>
      {/* <FileInput value={formik.values.profilePicture} name='profilePicture' onChange={(e) => handleFileChange('profilePicture', e)} error={{ isError: !!formik.touched.profilePicture && !!formik.errors.profilePicture, message: formik.errors.profilePicture as WordingKey }} /> */}
      <TextInput value={formik.values.username} name='username' type='text' label='auth.username' onChange={(e) => handleChange('username', e.target.value)} error={{ isError: !!formik.touched.username && !!formik.errors.username, message: formik.errors.username as WordingKey }} />
      <TextInput value={formik.values.email} name='email' type='email' label='auth.email' onChange={(e) => handleChange('email', e.target.value)} error={{ isError: !!formik.touched.email && !!formik.errors.email, message: formik.errors.email as WordingKey }} />
      <TextInput value="**************" name='password' type='password' label='auth.password' isDisabled onChange={(e) => handleChange('password', e.target.value)} error={{ isError: !!formik.touched.password && !!formik.errors.password, message: formik.errors.password as WordingKey }} />
    </div>
  );
}

