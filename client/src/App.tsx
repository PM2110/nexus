import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import './styles/common.css';

function App() {
  return (
    <TranslationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}

export default App;
