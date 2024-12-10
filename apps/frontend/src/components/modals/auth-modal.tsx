import { type LoginDto, type RegisterDto } from '@playpal/schemas';
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import React, { useCallback, useEffect, useState } from "react";

import LoginForm from "@/components/form/login-form";
import RegisterForm from "@/components/form/register-form";
import FullModal from "@/components/modals/full-modal";
import { type WordingKey } from "@/context/i18n/i18n-service";
import { loginInitalValues, loginSchema } from "@/forms/login-schema";
import { registerInitalValues, registerSchema } from "@/forms/register-schema";
import useAuth from '@/hooks/use-auth';
import useTranslation from "@/hooks/use-translation";
import { useLoginMutation, useRegisterMutation } from '@/services/auth';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  notClosable?: boolean;
}

const loginTexts: Record<string, WordingKey> = {
  title: "auth.login.title",
  button: "auth.login.noAccount",
  submit: "auth.login.submit",
};

const registerTexts: Record<string, WordingKey> = {
  title: "auth.register.title",
  button: "auth.register.alreadyAccount",
  submit: "auth.register.submit",
};

export default function AuthModal({ isVisible, onClose, notClosable = false }: Props): React.JSX.Element {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [texts, setTexts] = useState<Record<string, WordingKey>>(loginTexts);

  const i18n = useTranslation();
  const [ register ] = useRegisterMutation();
  const [ login ] = useLoginMutation();
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (isRegisterMode) {
      setTexts(registerTexts);
    } else {
      setTexts(loginTexts);
    }
  }, [isRegisterMode]);

  const handleSubmit = (values: LoginDto | RegisterDto) => {
    if (isRegisterMode) {
      register(values as RegisterDto).then(({ error }) => {
        if (error) {
          console.error("Register", error);
          throw new Error("Register failed");
        }
        closeModal();
        return;
      }).catch((error) => {
        console.error(error);
      });
      return;
    }
    login(values as LoginDto).then(({ error }) => {
      if (error) {
        console.error("Login", error);
        throw new Error("Login failed");
      }
      return;
    }).then(() => {
      refreshUser();
      closeModal();
      return;
    }).catch((error) => {
      console.error(error);
    });
  };

  const formik = useFormik<LoginDto | RegisterDto>({
    initialValues: isRegisterMode ? registerInitalValues : loginInitalValues,
    validate: withZodSchema(isRegisterMode ? registerSchema : loginSchema),
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: true,
    validateOnBlur: false,
  });

  const handleModeChange = () => {
    setIsRegisterMode((prev) => !prev);
  };

  const closeModal = useCallback(() => {
    formik.resetForm();
    onClose();
  }, [formik, onClose]);

  return (
    <FullModal isVisible={isVisible} onClose={closeModal} notClosable={notClosable} title={texts.title}>
      <div className="w-[25vw] px-3 flex flex-row justify-end">
        <button onClick={handleModeChange} className="text-gray-500 underline text-xs">{i18n.t(texts.button)}</button>
      </div>
      <div className="px-4 w-3/4 pb-8">
        { isRegisterMode ? (
          <RegisterForm formik={formik as ReturnType<typeof useFormik<RegisterDto>>} />
        ) : (
          <LoginForm formik={formik} />
        )}
        <div className="w-full flex justify-center items-center mt-4">
          <button className="rounded-md bg-blue-600 py-1 px-3 text-white hover:scale-105 active:scale-100 disabled:bg-gray-500 flex flex-row gap-2"
            disabled={formik.isSubmitting}
            type="button"
            onClick={() => formik.handleSubmit()}
          >
            {i18n.t(texts.submit)}
          </button>
        </div>
      </div>
    </FullModal>
  );
}
