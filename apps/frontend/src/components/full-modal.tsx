import React, { type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import CrossIcon from "@/assets/images/svg/cross.svg?react";
import { type WordingKey } from "@/context/i18n/i18n-service";
import useTranslation from "@/hooks/use-translation";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  notClosable?: boolean;
  title?: WordingKey;
}

export default function FullModal({ isVisible, onClose, title, children, notClosable = false }: PropsWithChildren<Props>): React.JSX.Element | null {
  const i18n = useTranslation();

  if (!isVisible) {
    return null;
  }

  return createPortal((
    <div className="absolute z-50 w-screen h-screen bg-black/40 backdrop-blur-sm flex justify-center pt-60 overflow-auto" onClick={onClose}>
      <div className="w-[35wv] max-w-[35wv] max-h-[70vh] h-fit bg-white text-black flex flex-col items-center relative py-2 rounded-md transition-all duration-150 shadow-md" onClick={(e) => e.stopPropagation()}>
        {title && <p className="text-lg font-semibold mb-3 px-10">{i18n.t(title)}</p>}
        {!notClosable && (
          <button className="absolute cursor-pointer right-2 top-3 flex items-center justify-center" onClick={onClose}>
            <CrossIcon color="black" height={20} width={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  ), document.querySelector("#modal-root")!);
}
