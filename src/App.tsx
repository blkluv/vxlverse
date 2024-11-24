import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Editor } from "./pages/Editor";
import { Game } from "./pages/Game";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}
