import "bootstrap/dist/css/bootstrap.min.css";
import React, { StrictMode } from "react";
window.React = React;

import { createRoot } from "react-dom/client";
import { AccountProvider } from "/imports/ui/contexts/AccountContext";
import { Hello } from "/imports/ui/Hello";
import { Info } from "/imports/ui/Info";

const container = document.getElementById("react-target");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <AccountProvider>
      <Hello />
      <Info />
    </AccountProvider>
  </StrictMode>
);
