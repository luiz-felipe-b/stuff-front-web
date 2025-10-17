import React from "react";

export interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  rightContent?: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({
  children,
  className = "",
  onClick,
  rightContent,
}) => (
  <div
    className={`flex flex-row items-center justify-between bg-stuff-high border-2 border-b-4 border-black rounded-xl px-6 py-4 shadow-none hover:bg-stuff-light/80 transition cursor-pointer ${className}`}
    onClick={onClick}
  >
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
      {children}
    </div>
    {rightContent && <div className="ml-2">{rightContent}</div>}
  </div>
);

export default ListItem;
