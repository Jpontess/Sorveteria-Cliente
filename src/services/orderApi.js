// src/services/orderApi.js

// URL do seu backend no Render
const API_URL = 'https://sorveteria-backend-h7bw.onrender.com/api/order';

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar pedido');
    }

    return data;
  } catch (error) {
    console.error("Erro na API de Pedidos:", error);
    throw error;
  }
};