import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Editor } from "./pages/Editor";
import { Game } from "./pages/Game";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route path="/browse" element={<Browse />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}
