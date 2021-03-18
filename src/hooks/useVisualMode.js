import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    const newHistory = [...history];
    if (replace) {
      newHistory.pop()
    }
    
    newHistory.push(newMode);
    setHistory(newHistory);
  }

  function back() {
    if (history.length < 2) return;

    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
  }

  const mode = history[history.length - 1]
  return { mode, transition, back };
}
