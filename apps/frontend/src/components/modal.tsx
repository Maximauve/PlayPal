import { type TranslateOptions } from "i18n-js";
import React, { type PropsWithChildren } from "react";

import CrossIcon from "@/assets/images/svg/cross.svg?react";
import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";

interface Props {
  onClose: () => void;
  visible: boolean;
  classes?: string;
  title?: WordingKey;
  translateOptions?: TranslateOptions;
}
export default function Modal({ visible, onClose, classes, title, translateOptions, children }: PropsWithChildren<Props>): React.JSX.Element | null {
  const i18n = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <div className={`absolute z-10 rounded-md flex flex-col items-center justify-center shadow-lg ${classes}`}>
      <div className="py-2 px-9 relative flex flex-row justify-center items-center">
        {title && (
          <p className="font-semibold text-lg">{i18n.t(title, translateOptions)}</p>
        )}
      </div>
      <button className="absolute cursor-pointer right-2 top-3 flex items-center justify-center" onClick={onClose}>
        <CrossIcon color="black" height={20} width={20} />
      </button>
      {children}
    </div>
  );

}
