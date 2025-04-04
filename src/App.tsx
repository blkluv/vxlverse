import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Editor } from "./pages/Editor";
import { Game } from "./pages/Game";
import { Home } from "./pages/Home";
import { Games } from "./pages/Games";
import { Profile } from "./pages/Profile";
import { Favorites } from "./pages/Favorites";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ArtGallery } from "./pages/ArtGallery";
import { Galleries } from "./pages/Galleries";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/play/:id" element={<Game />} />
        <Route path="/galleries" element={<Galleries />} />
        <Route path="/gallery/:id" element={<ArtGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor/demo" element={<Editor />} />

        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* 404 Not Found page - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
