"use client";

import React from "react";

export interface AlertProps {
  type?: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}

const typeStyles = {
  error: "text-red-600 bg-red-100",
  success: "text-green-700 bg-green-100",
  info: "text-stuff-dark bg-stuff-bg",
};

const Alert: React.FC<AlertProps> = ({ type = "info", children, className = "" }) => (
  <div
    className={`rounded-lg px-4 py-2 mb-4 w-full text-center text-sm font-medium shadow-sm ${typeStyles[type]} ${className}`}
    role={type === "error" ? "alert" : type === "success" ? "status" : "note"}
  >
    {children}
  </div>
);

export default Alert;
