import { useState } from "react";
import LandingPage from "./components/LandingPage";
import MainPage from "./components/MainPage";

export default function App() {
  const [showMain, setShowMain] = useState(false);

  return (
    <>
      {!showMain ? (
        <LandingPage onContinue={() => setShowMain(true)} />
      ) : (
        <MainPage />
      )}
    </>
  );
}