import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";

interface SelectProps {
  id: string;
  name: string;
  onChange: ((field: string, newValue: string) => void) | ((value: string) => void) | ((value: string[]) => void);
  options: Array<{ label: string; value: string; description?: string }>;
  value: string[] | string;
  error?: { isError: boolean; message: WordingKey };
  isMultiple?: boolean;
  label?: WordingKey;
  required?: boolean;
}

export default function SelectInput({
  name,
  options,
  value,
  onChange,
  label,
  error,
  isMultiple = false,
}: SelectProps) {
  const i18n = useTranslation();
  const [currentValue, setCurrentValues] = useState<typeof value>(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (checkedItem: { label: string; value: string }) => {
    if (isMultiple) {
      if ((currentValue as string[]).includes(checkedItem.value)) {
        setCurrentValues(prevValues => (prevValues as string[]).filter(v => v !== checkedItem.value));
      } else {
        setCurrentValues(prevValues => [...(prevValues as string[]), checkedItem.value]);
      }
      (onChange as ((value: string[]) => void))(currentValue as string[]);
    } else {
      setCurrentValues(checkedItem.value);
      if (onChange.length === 1) {
        (onChange as ((value: string) => void))(checkedItem.value);
      } else if (onChange.length === 2) {
        (onChange as (field: string, newValue: string) => void)(name, checkedItem.value);
      }
    }
  };

  const toggleSelection = () => {
    setIsOpen(prev => !prev);
  };

  const selectedLabel = options.find(option => option.value === currentValue)?.label || '';

  return (
    <div className="flex flex-col items-start w-full px-5">
      {label && (
        <p className="block text-sm font-medium text-gray-700">
          {i18n.t(label)}
        </p>
      )}
      <div className="w-full relative">
        <button type="button" onClick={toggleSelection}
          className={"w-full max-w-full m-0 bg-transparent border border-gray-400 rounded-sm py-1 pl-2 flex flex-row justify-between items-center" + (isOpen && ('rounded-t-md border-b-0 '))}
        >
          <span>
            {isMultiple 
              ? (label && ((i18n.t(label) + ((currentValue.length > 0) ? ` (${currentValue.length})` : ''))))
              : selectedLabel 
            }
          </span>
          <FontAwesomeIcon icon={faChevronDown} width={22} height={22} color="black" className={'transition-transform duration-150' + (isOpen && ' rotate-180')} />
        </button>
        <div className={"grid absolute top-full left-0 right-0 z-10 transition-[grid-template-rows] duration-500" + (isOpen ? ' grid-rows-[1fr] delay-75' : ' grid-rows-[0fr]')}>
          <div className={"overflow-hidden"}>
            <ul className={"bg-white rounded-t-none rouded-b-md py-2 px-4 border border-t-0 border-gray-400 max-h-40 overflow-y-auto"}>
              {options.map((option, index) => {
                let checked = false;
                checked = isMultiple ? (currentValue as string[]).includes(option.value) : currentValue === option.value;
                return (
                  <li className={index === options.length ? '' : 'mb-1'} key={option.value}>
                    <label>
                      <input className="mr-2" type={isMultiple ? 'checkbox' : 'radio'} name={name} value={option.value} onChange={() => handleClick(option)} checked={checked} />
                      {option.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      
      {error?.isError && (
        <p className="text-red-600 text-sm w-full">{i18n.t(error.message)}</p>
      )}
    </div>
  );
}
