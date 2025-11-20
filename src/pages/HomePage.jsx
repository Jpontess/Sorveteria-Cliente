import React, { useState, useEffect } from 'react';
import * as productApi from '../services/productApi';
import { ProductCard } from '../components/ProductCard';
import { socket } from '../services/socketsApi';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 👇 1. Movemos a função 'loadProducts' para DENTRO do useEffect
    const loadProducts = async () => {
      try {
        const responseData = await productApi.getProducts();
        
        let productsArray;
        if (responseData && responseData.data && Array.isArray(responseData.data.produtos)) {
          productsArray = responseData.data.produtos;
        } else if (Array.isArray(responseData)) {
          productsArray = responseData;
        } else if (responseData && Array.isArray(responseData.products)) {
          productsArray = responseData.products;
        } else if (responseData && Array.isArray(responseData.data)) {
          productsArray = responseData.data;
        } else {
          productsArray = []; 
        }

        const availableProducts = productsArray.filter(p => p.isAvailable);
        setProducts(availableProducts);

      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
      setIsLoading(false);
    };

    // 2. Chamamos a função imediatamente
    loadProducts();

    function onProductsUpdate() {
      console.log("🔄 Atualizando catálogo em tempo real...");
      loadProducts();
    }

    socket.on('connect', () => console.log("🟢 Cliente conectado ao Socket"));
    socket.on('update_products', onProductsUpdate);

    return () => {
      socket.off('update_products', onProductsUpdate);
    };
  }, []); // Array de dependências vazio, roda apenas ao montar

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center mt-5 py-5">
          <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center p-5 border border-secondary rounded bg-dark mt-4">
          <i className="bi bi-emoji-frown fs-1 text-muted mb-3 d-block"></i>
          <h4 className="text-white">Ops! Estamos sem produtos no momento.</h4>
          <p className="text-muted">O administrador está reabastecendo o estoque.</p>
        </div>
      );
    }

    return (
      <div className="row g-4">
        {products.map(product => (
          <div key={product._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4 mb-5">
      
      {/* --- HERO BANNER (A "Cara" da Loja) --- */}
      <div className="hero-banner text-center text-md-start d-md-flex justify-content-between align-items-center">
        <div>
          <h1 className="hero-title fw-bold mb-2">Sorvesan Av. Zélia</h1>
          <p className="lead text-secondary mb-4">Sabor, qualidade e frescor entregues na sua porta.</p>
          <a href="#menu" className="btn btn-primary btn-lg shadow-lg rounded-pill px-4">
            Ver Cardápio <i className="bi bi-arrow-down-circle ms-2"></i>
          </a>
        </div>
        <div className="d-none d-md-block">
          {/* Ícone decorativo ou imagem de sorvete */}
          <i className="bi bi-snow2 text-secondary opacity-25" style={{ fontSize: '8rem' }}></i>
        </div>
      </div>

      <div id="menu" className="mb-4 pt-3">
        <h3 className="border-start border-4 border-danger ps-3 text-white">Destaques da Vitrine</h3>
      </div>
      
      {renderContent()}
    </div>
  );
}