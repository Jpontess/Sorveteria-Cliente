// src/services/productApi.js

// 1. Defina a URL base do seu backend.
// (Mude isso para a URL correta do seu servidor Node.js/Java/etc.)
const API_URL = 'http://localhost:8080/api/products';

// NOTA: 'fetch' não simula mais atraso. O atraso será o da sua rede real.
// ... (o resto do arquivo continua igual) ...
export const getProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos da API');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar produto');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; // Re-lança o erro para o componente (ex: modal)
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'PUT', // ou 'PATCH'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar produto');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar produto');
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
};