import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);
  function transition(newMode, replace = false) {
    if (replace) {
      setHistory((prev) => {
        return [...prev.slice(0, -1), newMode];
      });
    } else {
      setHistory((prev) => [...prev, newMode]);
    }
  }

  function back() {
    if (history.length < 2) return;

    setHistory((prev) => {
      const prevHistory = [...prev];
      prevHistory.pop();
      return prevHistory;
    });
  }

  const mode = history.slice(-1)[0];
  return { mode, transition, back };
}
