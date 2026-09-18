import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ShieldPage from './pages/Shield';
import SpendPage from './pages/Spend';
import SavePage from './pages/Save';

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout lang={lang} setLang={setLang} />}>
          <Route index element={<ShieldPage />} />
          <Route path="spend" element={<SpendPage />} />
          <Route path="save" element={<SavePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
