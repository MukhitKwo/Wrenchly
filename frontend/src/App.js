import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p style={{ textAlign: "center", padding: "20px" }}>
          Wrenchly © 2025
        </p>
      </footer>
    </div>
  );
}
export default App;
