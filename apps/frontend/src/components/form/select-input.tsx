import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";

interface SelectProps {
  id: string;
  name: string;
  onChange: ((value: string) => void) | ((value: string[]) => void);
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
  // required = false,
}: SelectProps) {
  const i18n = useTranslation();
  const [currentValue, setCurrentValues] = useState<typeof value>(value);
  const [isOpen, setIsOpen] = useState(false);

  const valuesOptions = useMemo(() => {
    return options.map(option => option.value);
  }, [options]);

  const handleClick = (checkedItem: string) => {
    if (isMultiple) {
      if ((currentValue as string[]).includes(checkedItem)) {
        setCurrentValues(prevValues => (prevValues as string[]).filter(v => v !== checkedItem));
      } else {
        setCurrentValues(prevValues => [...(prevValues as string[]), checkedItem]);
      }
      (onChange as ((value: string[]) => void))(currentValue as string[]);
    } else {
      setCurrentValues(checkedItem);
      (onChange as ((value: string) => void))(currentValue as string);
    }
  };

  const toggleSelection = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col items-start w-full px-5">
      {!isMultiple && label && (
        <p className="block text-sm font-medium text-gray-700">
          {i18n.t(label)}
        </p>
      )}
      <div className="w-full">
        <button onClick={toggleSelection}
          className={"w-full max-w-full m-0 bg-transparent border border-gray-300 rounded-sm py-1 pl-2 flex justify-between items-center" + isOpen && ('rounded-t-md border-b-0 ')}
        >
          <span>
            {isMultiple 
              ? (label && (i18n.t(label) + (currentValue.length > 0) && ` (${currentValue.length})`))
              : (currentValue ?? label)
            }
          </span>
          <FontAwesomeIcon icon={faChevronDown} width={22} height={22} color="black" className={'transition-transform duration-150' + isOpen && 'rotate-180'} />
        </button>
        <div>
          <div>
            <ul>
              {options.map((option) => {
                let checked = false;
                checked = isMultiple && Array.isArray(value) ? value.some(v => valuesOptions.includes(v)) : valuesOptions.includes(value as string);
                return (
                  <li>
                    <label>
                      <input type={isMultiple ? 'checkbox' : 'radio'} key={option.value} name={name} value={option.value} onChange={() => handleClick(option.value)} checked={checked} />
                      {option.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* <select
        id={id}
        name={name}
        multiple
        value={value}
        onChange={handleSelectChange}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
          error?.isError
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select> */}
      
      {error?.isError && (
        <p className="text-red-600 text-sm w-full">{i18n.t(error.message)}</p>
      )}
    </div>
  );
}
