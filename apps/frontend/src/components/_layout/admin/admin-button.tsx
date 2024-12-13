import { type PropsWithChildren } from "react";

interface Props {
  onClick: () => void;
  className?: string;
}

export default function AdminButton({ onClick, children, className = '' }: PropsWithChildren<Props>) {
  return (
    <button className={"bg-admin-background-light rounded-md p-2 shadow-admin cursor-pointer text-text-light active:translate-y-0.5 " + className } onClick={onClick}>
      {children}
    </button>
  );
}
