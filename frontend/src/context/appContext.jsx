import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
	const [state, setState] = useState(() => {
		// useState chama uma função que determina qual conteudo ela tem, so roda uma vez na primeira render
		const stored = localStorage.getItem("appState");
		return stored ? JSON.parse(stored) : {};
	});

	useEffect(() => {
        // hook do react que atualiza o localstorage sempre o [state] é atualizado
		localStorage.setItem("appState", JSON.stringify(state));
	}, [state]);

	return <AppContext.Provider value={{ state, setState }}>
        {children}
    </AppContext.Provider>;
}

export function useApp() {
	return useContext(AppContext);
}
