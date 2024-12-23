import './App.css';
import HomePage from './pages/HomePage';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TranscriptionHistory from './pages/TranscriptionHistory';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<HomePage />}></Route>
      <Route path='/transcriptionHistory' element={<TranscriptionHistory />}></Route>
    </Routes>
    </Router>
  );
}

export default App;
