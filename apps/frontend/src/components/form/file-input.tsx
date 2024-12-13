import React, { useState } from "react";

import PenIcon from "@/assets/images/svg/pen.svg?react";
import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";

interface FileInputProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: { isError: boolean; message: WordingKey };
  imageUrl?: string;
}

export default function FileInput({ name, handleFileChange, error, imageUrl }: FileInputProps): React.JSX.Element {
  const i18n = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    handleFileChange(event);
  };

  return (
    <div className="relative flex justify-center items-center">
      <label htmlFor={name} className="cursor-pointer">
        <div className="w-32 h-32 relative rounded overflow-hidden">
          <input
            id={name}
            name={name}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (imageUrl ? (
            <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">+</div>
          ))}

          <div className="absolute bottom-2 right-2">
            <PenIcon className="w-6 h-6 bg-white p-1 rounded-full" />
          </div>
        </div>
      </label>
      
      {error?.isError && (
        <span className="text-red-600 text-sm w-full">{i18n.t(error.message)}</span>
      )}
    </div>
  );
}
