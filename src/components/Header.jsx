import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          
          {/* 1. MARCA (Fica na esquerda) */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-shop me-2 text-hite" style={{ fontSize: '1.7rem' }}></i>
            <span className="fw-bold fs-5" style={{ letterSpacing: '1px' }}></span>
          </Link>

          {/* 2. ÁREA DO CARRINHO + MENU (Fica na direita) 
             Usamos 'order-lg-last' para garantir que no Desktop fique na ponta direita.
             No mobile, como está logo depois da marca, já fica na direita naturalmente.
          */}
          <div className="d-flex align-items-center order-lg-last">
            
            {/* O Carrinho agora está FORA do 'collapse', por isso aparece sempre */}
            <Link className="btn btn-primary position-relative me-2" to="/carrinho">
              <i className="bi bi-cart-fill"></i>
              {/* Texto 'Carrinho' só aparece no Desktop para economizar espaço no mobile */}
              <span className="d-none d-md-inline ms-2">Carrinho</span>
              
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                  <span className="visually-hidden">itens no carrinho</span>
                </span>
              )}
            </Link>

            {/* Botão Hambúrguer (Só aparece no Mobile) */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* 3. LINKS DE NAVEGAÇÃO (Escondidos no mobile, aparecem no meio no Desktop) */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
               {/* Se tiver links no futuro, eles aparecerão aqui */}
               {/* <li className="nav-item"><Link to="/sobre" className="nav-link">Sobre</Link></li> */}
            </ul>
          </div>

        </div>
      </nav>
    </header>
  );
}