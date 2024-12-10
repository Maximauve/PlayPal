import React, { Fragment, useState } from 'react';

import ClosedEyeIcon from '@/assets/images/svg/closed-eye.svg?react';
import EyeIcon from '@/assets/images/svg/eye.svg?react';
import { type WordingKey } from '@/context/i18n/i18n-service';
import useTranslation from '@/hooks/use-translation';

interface Props {
  name: string;
  error?: { isError: boolean; message: WordingKey };
  isDisabled?: boolean;
  label?: WordingKey;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: WordingKey;
  required?: boolean;
  type?: 'email' | 'password' | 'text';
  value?: string;
}

const iconProps = {
  height: 20,
  width: 20,
  color: 'black',
};

export default function TextInput({ name, isDisabled, error, label, onChange, placeholder, required, value, type = 'text' }: Props): React.JSX.Element {
  const [inputType, setInputType] = useState(type);

  const i18n = useTranslation();

  const handleTogglePassword = () => {
    setInputType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <Fragment>
      <div className='flex flex-col items-start w-full px-5'>
        { label && (
          <label htmlFor={`${name}-input`} className={'text-sm text-black ' + (required ? "after:content-['*']" : "")}>{i18n.t(label)}</label>
        )}
        <div className='relative w-full'>
          <input className={'rounded-sm text-black bg-white border disabled:bg-gray-500 w-full py-1 pl-2 ' + (error?.isError ? 'border-red-600 focus-visible:outline-red-600' :'border-gray-400')}
            type={inputType}
            name={name}
            id={`${name}-input`}
            disabled={isDisabled}
            onChange={onChange}
            defaultValue={value}
            required={required}
            placeholder={placeholder ? i18n.t(placeholder) : undefined}
          />
          {type === 'password' && (
            <button className='absolute right-2 top-1.5' onClick={handleTogglePassword}>{inputType === 'password' ? <EyeIcon {...iconProps} /> : <ClosedEyeIcon {...iconProps} />}</button>
          )}
        </div>
        {error?.isError && (
          <span className='text-red-600 text-sm w-full'>{i18n.t(error.message)}</span>
        )}
      </div>
    </Fragment>
  );
}
