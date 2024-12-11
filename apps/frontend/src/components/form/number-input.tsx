import React, { Fragment } from 'react';

import { type WordingKey } from '@/context/i18n/i18n-service';
import useTranslation from '@/hooks/use-translation';

interface NumberInputProps {
  name: string;
  error?: { isError: boolean; message: WordingKey };
  isDisabled?: boolean;
  label?: WordingKey;
  max?: number;
  min?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: WordingKey;
  required?: boolean;
  value?: number;
}

export default function NumberInput({
  name,
  isDisabled,
  error,
  label,
  onChange,
  placeholder,
  required,
  value,
  max,
  min,
}: NumberInputProps): React.JSX.Element {
  const i18n = useTranslation();

  return (
    <Fragment>
      <div className='flex flex-col items-start w-full px-5'>
        {label && (
          <label
            htmlFor={`${name}-input`}
            className={
              'text-sm text-black ' + (required ? "after:content-['*']" : '')
            }
          >
            {i18n.t(label)}
          </label>
        )}
        <div className='relative w-full'>
          <input
            className={
              'rounded-sm text-black bg-white border disabled:bg-gray-500 w-full py-1 pl-2 ' +
              (error?.isError
                ? 'border-red-600 focus-visible:outline-red-600'
                : 'border-gray-400')
            }
            type='number'
            name={name}
            id={`${name}-input`}
            disabled={isDisabled}
            onChange={onChange}
            defaultValue={value}
            required={required}
            placeholder={placeholder ? i18n.t(placeholder) : undefined}
            min={min}
            max={max}
          />
        </div>
        {error?.isError && (
          <span className='text-red-600 text-sm w-full'>
            {i18n.t(error.message)}
          </span>
        )}
      </div>
    </Fragment>
  );
}