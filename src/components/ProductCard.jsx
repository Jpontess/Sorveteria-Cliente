import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Impede clique duplo se clicar no card
    
    addToCart(product);
    
    // Feedback visual
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }}>
      {/* ZONA DA IMAGEM */}
      <div 
        className="card-img-top d-flex align-items-center justify-content-center bg-light overflow-hidden" 
        style={{ height: '200px', position: 'relative' }}
      >
        {/* Lógica condicional: Mostra imagem ou ícone */}
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-100 h-100" 
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          <i className="bi bi-image" style={{ fontSize: '3rem', color: '#aaa' }}></i>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        
        <p className="card-text text-secondary small flex-grow-1">
          {product.description || "Produto sem descrição"}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4 className="mb-0 text-dark">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </h4>
          
          <button 
            className={`btn ${isAdded ? 'btn-success' : 'btn-primary'} transition-all`} 
            onClick={handleAddToCart}
            disabled={isAdded}
            style={{ transition: 'all 0.2s' }}
          >
            {isAdded ? (
              <><i className="bi bi-check-lg me-1"></i> Adicionado</>
            ) : (
              <><i className="bi bi-cart-plus-fill me-1"></i> Adicionar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}