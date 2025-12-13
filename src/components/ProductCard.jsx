import React from 'react';
import { useCart } from '../context/CartContext';

export function ProductCard({ product }) {
  const { addToCart, decreaseQuantity, cart } = useCart();

  // Verifica quantidade atual no carrinho
  const itemInCart = cart.find((item) => item._id === product._id);
  const quantity = itemInCart ? itemInCart.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (decreaseQuantity) {
      decreaseQuantity(product._id);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }}>
      
      {/* Imagem */}
      <div 
        className="card-img-top d-flex align-items-center justify-content-center bg-light overflow-hidden" 
        style={{ height: '200px', position: 'relative' }}
      >
        {quantity > 0 && (
            <div className="position-absolute top-0 end-0 m-2 badge rounded-pill bg-danger shadow" style={{zIndex: 10}}>
                {quantity}
            </div>
        )}

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

      {/* Conteúdo */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        
        <p className="card-text text-secondary small flex-grow-1">
          {product.description || "Produto sem descrição"}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4 className="mb-0 text-dark">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </h4>
          
          {/* Botões Condicionais */}
          {quantity > 0 ? (
            <div className="d-flex align-items-center bg-danger rounded p-1" style={{ gap: '5px' }}>
                <button 
                    className="btn btn-sm btn-danger text-white border-0 p-0 px-2 fw-bold"
                    onClick={handleDecrease}
                >
                    <i className="bi bi-dash-lg"></i>
                </button>
                
                <span className="text-white fw-bold px-2" style={{ minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                </span>

                <button 
                    className="btn btn-sm btn-danger text-white border-0 p-0 px-2 fw-bold"
                    onClick={handleAddToCart}
                >
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>
          ) : (
            <button 
                className="btn btn-primary transition-all" 
                onClick={handleAddToCart}
                style={{ transition: 'all 0.2s' }}
            >
                <i className="bi bi-cart-plus-fill me-1"></i> Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}