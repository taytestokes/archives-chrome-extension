import React from "react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { token, clearTokenFromStorage } = useAuth();

  return (
    <div className="w-full flex items-center">
      <h1 className="text-xl font-semibold">Archives</h1>
      {token && (
        <button
          className="border border-zinc-700 hover:bg-zinc-800 transition rounded-md p-1 ml-auto"
          onClick={clearTokenFromStorage}
          aria-label="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
};
