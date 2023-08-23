import React from "react";
import { Header } from "./Header";

export const Layout = ({ children }) => {
  return (
    <div className="w-72 bg-zinc-900 py-6 px-4 text-white mx-auto">
      <Header />
      {typeof children === "function" ? children() : children}
    </div>
  );
};
