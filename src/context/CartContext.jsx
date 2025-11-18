import React, { createContext, useState, useContext } from 'react';

// 1. Criar o Contexto
const CartContext = createContext();

// 2. Criar o Provedor (o componente que vai envolver o App)
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Função para adicionar ao carrinho
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Verifica se o produto já está no carrinho
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // Se já existe, apenas aumenta a quantidade
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se é novo, adiciona com quantidade 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    console.log("🛒 Produto adicionado:", product.name);
  };

  // Função para remover do carrinho
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total de itens (para o ícone do carrinho)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calcular valor total do pedido
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        totalItems,
        cartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Hook personalizado para facilitar o uso
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}