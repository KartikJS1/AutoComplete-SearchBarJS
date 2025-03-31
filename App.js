import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cache, setCache] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      if (!input.trim()) {
        setResults([]);
        return;
      }

      if (cache[input]) {
        console.log("Cache hit:", input);
        setResults(cache[input]);
        return;
      }

      console.log("API CALL");
      try {
        const data = await fetch(
          "https://dummyjson.com/recipes/search?q=" + input
        );
        const response = await data.json();
        setResults(response?.recipes || []);
        setCache((prev) => ({ ...prev, [input]: response?.recipes || [] }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setResults([]);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [input, cache]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      setInput(results[selectedIndex].name);
      setShowResults(false);
    }
  };

  return (
    <div className="App">
      <h1>Autocomplete SearchBarJS</h1>
      <div>
        <input
          className="input-box"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onKeyDown={handleKeyDown}
        />
        {showResults && results.length > 0 && (
          <div className="results-container">
            {results.map((r, index) => (
              <span
                className={`result ${
                  index === selectedIndex ? "selected" : ""
                }`}
                key={r.id}
              >
                {r.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
