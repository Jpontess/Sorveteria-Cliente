// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* A rota "/" é a Home */}
      <Route path="/" element={<HomePage />} />
      
      {}
      <Route path='/carrinho' element={<CheckoutPage/>}></Route>

      {/* Rota 404 */}
      <Route path="*" element={<h1>Página Não Encontrada</h1>} />
    </Routes>
  );
}