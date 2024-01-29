import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/login" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
