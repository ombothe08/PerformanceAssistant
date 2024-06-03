import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import LoginPage from "../logInPage/LogInPage";
import HomePage from "../HomePage/HomePage";
import useExcelParameters from "../uploadFilePage/UseExcelParametersReturn";
import ParameterListPage from "../parameterListPage/ParameterListPage";

const AppRouter: React.FC = () => {
  const excelParameters = useExcelParameters();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/homepage"
          element={<HomePage useExcelParameters={ excelParameters } />} // Pass excelParameters as a prop
        />
        <Route path="/upload" element={<ParameterListPage useExcelParameters={ excelParameters } />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
