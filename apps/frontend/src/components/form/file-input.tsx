import React, { Fragment, useRef } from "react";

import useTranslation from "@/hooks/use-translation";

interface Props {
  name: string;
  error?: { isError: boolean; message: string };
  isDisabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: string;
}


export default function FileInput({ name, isDisabled, error, required, value, onChange }: Props): React.JSX.Element {
  const fileInputReference = useRef<HTMLInputElement>(null);

  const i18n = useTranslation();

  const handleEditClick = () => {
    fileInputReference.current?.click();
  };

  return (
    <Fragment>
      <input type="file" ref={fileInputReference} className="hidden" onChange={onChange}
        name={name}
        src={value}
        id={`${name}-input`}
        disabled={isDisabled}
        defaultValue={value}
        required={required}
      />
      <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer" onClick={handleEditClick}>
        <img src={value ?? "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover" />
      </div>
      {error?.isError && (
        <span className='text-red-600 text-sm w-full'>{i18n.t(error.message)}</span>
      )}
    </Fragment>
  );
}