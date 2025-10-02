"use client";

import React from "react";
import { Transition } from "@headlessui/react";
import { Toaster, ToastIcon, resolveValue, Toast } from "react-hot-toast";

const getToastClasses = (t: Toast) => {
  if (t.type === "error") {
    return "text-white border-danger-base border-2";
  }
  if (t.type === "success") {
    return "text-white border-success-base border-2";
  }
  return "text-stuff-dark border-stuff-mid border-2";
};

const TailwindToaster = () => {
  return (
    <Toaster position="top-center" gutter={12}>
      {(t) => (
  <Transition as="div"
          appear
          show={t.visible}
          className={`bg-stuff-white transform flex items-center font-onest rounded-xl shadow-lg px-4 py-3 min-w-[240px] max-w-xs ${getToastClasses(t)}`}
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={t} />
          <span className="px-2 break-words">{resolveValue(t.message, t)}</span>
        </Transition>
      )}
    </Toaster>
  );
};

export default TailwindToaster;
