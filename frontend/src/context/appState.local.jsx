import { createContext, useContext, useEffect, useState } from "react";

const LocalAppStateContext = createContext(null);

export function LocalAppStateProvider({ children }) {
	const [state, setState] = useState(() => {
		const stored = localStorage.getItem("myLocalAppState");
		return stored ? JSON.parse(stored) : {};
	});

	useEffect(() => {
		const { feedback, ...stateToStore } = state;
		localStorage.setItem(
			"myLocalAppState",
			JSON.stringify(stateToStore)
		);
	}, [state]);

	const clear = () => {
		localStorage.removeItem("myLocalAppState");
		setState({});
	};

	return <LocalAppStateContext.Provider value={{ state, setState, clear }}>{children}</LocalAppStateContext.Provider>;
}

export function useLocalAppState() {
	return useContext(LocalAppStateContext);
}
