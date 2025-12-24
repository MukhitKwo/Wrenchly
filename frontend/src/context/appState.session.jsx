import { createContext, useContext, useState, useEffect } from "react";

const SessionAppStateContext = createContext(null);

export function SessionAppStateProvider({ children }) {
  const [state, setState] = useState(() => {
    const stored = sessionStorage.getItem("mySessionAppState");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    sessionStorage.setItem("mySessionAppState", JSON.stringify(state));
  }, [state]);

  const clear = () => {
    sessionStorage.removeItem("mySessionAppState");
    setState({});
  };

  return (
    <SessionAppStateContext.Provider value={{ state, setState, clear }}>
      {children}
    </SessionAppStateContext.Provider>
  );
}

export function useSessionAppState() {
  return useContext(SessionAppStateContext);
}
