import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Editor } from './pages/Editor';
import { Home } from './pages/Home';
import { Game } from './pages/Game';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}