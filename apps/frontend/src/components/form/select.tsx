import React from "react";

interface SelectProps {
  id: string;
  name: string;
  onChange: (value: string[]) => void;
  options: Array<{ label: string; value: string; description?: string }>;
  value: string[];
  error?: { isError: boolean; message?: string };
  label?: string;
}

export default function Select({
  id,
  name,
  options,
  value,
  onChange,
  label,
  error,
}: SelectProps) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selectedValues);
  };

  return (
    <div className="space-y-2 w-full px-5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
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
      </select>
      
      {error?.isError && error.message && (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
