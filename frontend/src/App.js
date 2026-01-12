import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Feedback from "./components/Feedback.jsx";
import Navbar from "./components/navbar";
import { useLocalAppState } from "./context/appState.local";
import BackToTop from "./components/backToTop";

function App() {
  const { state } = useLocalAppState();

  useEffect(() => {
    if (state?.definicoes?.tema === "escuro") {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [state?.definicoes?.tema]);

  return (
    <div className="app-container">
      <Navbar />
      <Feedback />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p style={{ textAlign: "center", padding: "20px" }}>
          Wrenchly ©️ 2026
        </p>
      </footer>
      <BackToTop />
    </div>
  );
}

export default App;
