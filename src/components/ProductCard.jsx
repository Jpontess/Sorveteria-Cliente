// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export function ProductCard({ product }) {
  const {addToCart} = useCart()
  
  const handleAddToCart = (e) => {
    e.stopPropagation()

    addToCart(product)
  };

   const handleCardClick = () => {
    // (Futuro: Abrir modal de detalhes)
    console.log("Clicou no CARD:", product.name);
  };

  return (
    <div className="card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      {/* Imagem Placeholder */}
      <div 
        className="card-img-top d-flex align-items-center justify-content-center bg-light" 
        style={{ height: '200px', color: '#aaa' }}
      >
        <i className="bi bi-image" style={{ fontSize: '3rem' }}></i>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Nome do Produto */}
        <h5 className="card-title">{product.name}</h5>
        
        {/* Descrição */}
        <p className="card-text text-muted small flex-grow-1">
          {product.description || "Produto sem descrição"}
        </p>
        
        {/* Preço e Botão */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4 className="mb-0 text-dark">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </h4>
          <button className="btn btn-primary" onClick={handleAddToCart}>
            <i className="bi bi-cart-plus-fill me-1"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}