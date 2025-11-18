// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import * as productApi from '../services/productApi';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função para carregar os produtos da API
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const responseData = await productApi.getProducts();
        
        // --- DEBUG ---
        console.log("Dados recebidos da API:", responseData);
        // --- FIM DEBUG ---

        // VAMOS VERIFICAR O QUE VEIO ANTES DE USAR
        let productsArray;

        // 👇 --- CORREÇÃO AQUI --- 👇
        // Verificando a estrutura que você mandou: { data: { produtos: [...] } }
        if (responseData && responseData.data && Array.isArray(responseData.data.produtos)) {
          // CASO CORRETO: A API retornou { data: { produtos: [...] } }
          productsArray = responseData.data.produtos;
        }
        // --- FIM DA CORREÇÃO ---
        
        else if (Array.isArray(responseData)) {
          // CASO 1: A API retornou o array diretamente
          productsArray = responseData;
        } else if (responseData && Array.isArray(responseData.products)) {
          // CASO 2: A API retornou { products: [...] }
          productsArray = responseData.products;
        } else if (responseData && Array.isArray(responseData.data)) {
          // CASO 3: A API retornou { data: [...] }
          productsArray = responseData.data;
        } else {
          // CASO 4: Não sabemos o que veio
          console.error("Formato de dados inesperado!", responseData);
          productsArray = []; // Usamos um array vazio para não quebrar
        }

        // A LÓGICA PRINCIPAL: Filtra apenas os produtos disponíveis
        const availableProducts = productsArray.filter(p => p.isAvailable);
        
        setProducts(availableProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, []); // O array vazio [] garante que rode só uma vez

  // --- Renderização ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center p-5 border rounded bg-light">
          <h4>Nenhum produto disponível no momento</h4>
          <p>Por favor, volte mais tarde!</p>
        </div>
      );
    }

    // Layout em Grelha (Grid) de produtos
    return (
      <div className="row g-4">
        {products.map(product => (
          <div key={product._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
            {/* Usamos um componente separado para o Card */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-5 mb-4">
      <div className="text-center mb-4">
        <h1 className="display-5">Nosso Cardápio</h1>
        <p className="lead text-white">Escolha seus produtos favoritos</p>
      </div>
      
      {renderContent()}
    </div>
  );
}