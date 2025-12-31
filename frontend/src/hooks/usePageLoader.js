import { useCallback, useState } from "react";

export default function usePageLoader(initial = true) {
	const [loading, setLoading] = useState(initial);

	const runWithLoading = useCallback(async (fn) => {
		setLoading(true);
		try {
			await fn();
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		loading,
		setLoading,
		runWithLoading,
	};
}
