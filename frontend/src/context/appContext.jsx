import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
	const [state, setState] = useState(() => {
		const stored = localStorage.getItem("appState");
		return stored ? JSON.parse(stored) : {};
	});

	useEffect(() => {
		localStorage.setItem("appState", JSON.stringify(state));
	}, [state]);

	const clearAppState = () => {
		localStorage.removeItem("appState");
		setState({});
	};

	return <AppContext.Provider value={{ state, setState, clearAppState }}>{children}</AppContext.Provider>;
}

export function useLocalStorage() {
	return useContext(AppContext);
}
