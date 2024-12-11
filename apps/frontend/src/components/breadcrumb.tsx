import React, { type PropsWithChildren } from "react";

export interface BreadcrumbItem {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface Props {
  items: BreadcrumbItem[];
  classes?: string;
  separator?: string;
}

export default function Breadcrumb({
  items,
  separator = "/",
  classes,
}: PropsWithChildren<Props>): React.JSX.Element {
  return (
    <nav
      aria-label="breadcrumb"
      className={`flex items-center space-x-2 ${classes}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span
            className={`${
              item.isActive
                ? "font-semibold text-blue-600"
                : "text-gray-600 hover:text-blue-500 cursor-pointer"
            }`}
            onClick={item.onClick}
            role={item.onClick ? "button" : undefined}
          >
            {item.label}
          </span>
          {index < items.length - 1 && (
            <span className="text-gray-400">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
