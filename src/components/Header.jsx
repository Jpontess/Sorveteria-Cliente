import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// 1. A importação da imagem foi REMOVIDA
// import logoImage from '../assets/img/logo-sorvesan.png'; 

export function Header() {
  const {totalItens} = useCart()

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          
          {/* --- A MARCA (LOGO) --- */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            
            {/* 2. Voltamos a usar um ícone, mas com a cor da sua marca */}
            <i className="bi bi-shop me-2 text-brand-red" style={{ fontSize: '1.7rem' }}></i>
            
            {/* 3. Adicionamos o texto da marca com classes do Bootstrap */}
            <span className="fw-bold fs-5" style={{ letterSpacing: '1px' }}>Nome</span>
          </Link>

          {/* (Botão de 'hamburguer' para mobile) */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* --- LINKS DE NAVEGAÇÃO (Ex: Sobre, Contato) --- */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {/* (Links futuros podem ir aqui) */}
            </ul>

            {/* --- BOTÃO DE CARRINHO (À direita) --- */}
            {/* Este botão já está vermelho graças ao nosso 'global.css' */}
            <Link className="btn btn-primary" to="/carrinho">
              <i className="bi bi-cart-fill me-2"></i>
              Carrinho
              
               {/* 3. Renderização condicional do contador */}
              {totalItens > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItens}
                  <span className="visually-hidden">itens no carrinho</span>
                </span>
              )}
            </Link>
          </div>

        </div>
      </nav>
    </header>
  );
}