import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
 
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  
);



