import { type RegisterDto } from '@playpal/schemas';
import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import React from 'react';
import { toast, type ToastContent } from 'react-toastify';

import EditUserForm from '@/components/form/edit-user-form';
import { editUserInitialValues, editUserSchema } from '@/forms/edit-user-schema';
import useAuth from '@/hooks/use-auth';
import useTranslation from '@/hooks/use-translation';
import { useEditUserMutation, useRefreshUserQuery } from '@/services/user';


export default function UserProfilePage(): React.JSX.Element {
  const { data } = useRefreshUserQuery();
  const i18n = useTranslation();

  const [editUser] = useEditUserMutation();
  const { refreshUser } = useAuth();
  const formik = useFormik<Partial<RegisterDto>>({
    initialValues: {
      username: data?.username || editUserInitialValues.username,
      email: data?.email || editUserInitialValues.email,
      profilePicture: data?.image || editUserInitialValues.profilePicture,
    },
    validate: withZodSchema(editUserSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  const handleSubmit = (values: Partial<RegisterDto>) => {
    try {
      editUser({ id: data?.id || "", body: values }).unwrap();
      refreshUser();
      toast.success(i18n.t("notify.update.user.success") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error edit user", error);
      toast.error(i18n.t("notify.update.user.error") as ToastContent<string>, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    return;
  };

  return (
    <div className="user-profile-page h-full flex align-center justify-center text-4xl">
      <div className="w-1/3 flex flex-col align-center justify-center" >
        {/* <img src={DefaultProfile} className="cursor-pointer w-40 h-40 rounded-full active:scale-100" /> */}
        <EditUserForm formik={formik} />
        <div className='mt-4'>
          <button
            className='btn-primary bg-black w-full rounded-md text-lg hover:scale-105 active:scale-100 disabled:bg-gray-50 px-3 py-1'
            type="button"
            disabled={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}>
            {i18n.t("common.validate")}
          </button>
        </div>
      </div>
    </div>
  );
}