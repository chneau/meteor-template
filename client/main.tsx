import "bootstrap/dist/css/bootstrap.min.css";
import React, { StrictMode } from "react";
window.React = React;

import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "/imports/ui/components/Authorize";
import { AccountProvider } from "/imports/ui/contexts/AccountContext";
import { AdminPage } from "/imports/ui/pages/AdminPage";
import { HomePage } from "/imports/ui/pages/HomePage";

const container = document.getElementById("react-target");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {PrivateRoute({ path: "/admin", element: <AdminPage />, roles: ["admin"] })}
        </Routes>
      </AccountProvider>
    </BrowserRouter>
  </StrictMode>
);
