import { useEffect } from "react";
import { useLocalAppState } from "../context/appState.local";
import "./Feedback.css";

export default function Feedback() {
    const { state, setState } = useLocalAppState();

    useEffect(() => {
        if (!state.feedback) return;

        const timer = setTimeout(() => {
            setState((prev) => ({
                ...prev,
                feedback: null,
            }));
        }, 3000); // desaparece em 3s

        return () => clearTimeout(timer);
    }, [state.feedback, setState]);

    if (!state.feedback) return null;

    return (
        <div className={`feedback feedback-${state.feedback.type}`}>
            {state.feedback.message}
        </div>
    );
}
