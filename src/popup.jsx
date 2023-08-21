import React from "react";
import { createRoot } from "react-dom/client";

export const Popup = () => {
  return <div>popup</div>;
};

createRoot(document.getElementById("main")).render(<Popup />);
