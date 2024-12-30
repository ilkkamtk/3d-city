import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './views/Layout';
import Home from './views/Home';
import City from './views/City';
import { MapProvider } from './contexts/MapContext';

function App() {
  return (
    <MapProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/city" element={<City />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MapProvider>
  );
}

export default App;
