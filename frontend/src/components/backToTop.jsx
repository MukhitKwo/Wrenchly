import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./backToTop.css";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200); // mostrar o botão depois de 200px de scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button className="back-to-top" onClick={scrollToTop}>
      <FaArrowUp />
    </button>
  ) : null;
}

export default BackToTop;
