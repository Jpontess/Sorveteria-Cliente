import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderApi';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    paymentMethod: 'PIX', // Valor padrão exigido pelo backend
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Preparar o objeto para o Backend
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        totalAmount: cartTotal,
        // 👇 CORREÇÃO: Usar 'Pendente' para bater com o Enum do seu Backend
        status: 'Pendente', 
        items: cart.map(item => ({
          product: item._id, // O ID do produto (ref)
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // 2. Enviar para a API
      await createOrder(orderPayload);

      // 3. Sucesso! Limpar carrinho e redirecionar
      clearCart();
      alert('Pedido realizado com sucesso! O restaurante já foi notificado.');
      navigate('/'); // Volta para a Home

    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar pedido: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Se o carrinho estiver vazio, mostra aviso
  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <h2>Seu carrinho está vazio 😢</h2>
        <p className="lead">Adicione alguns sorvetes deliciosos antes de finalizar.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Voltar para o Cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-white mb-4">Finalizar Pedido</h2>
      
      <div className="row">
        {/* --- COLUNA DA ESQUERDA: FORMULÁRIO --- */}
        <div className="col-md-7 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-3">Seus Dados</h4>
              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="customerName" 
                    name="customerName" 
                    required 
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="customerPhone" className="form-label">WhatsApp / Telefone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="customerPhone" 
                    name="customerPhone" 
                    required 
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Endereço de Entrega</label>
                  <textarea 
                    className="form-control" 
                    id="address" 
                    name="address" 
                    rows="3" 
                    required 
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, Número, Bairro e Complemento"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="paymentMethod" className="form-label">Forma de Pagamento</label>
                  <select 
                    className="form-select" 
                    id="paymentMethod" 
                    name="paymentMethod" 
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>

                <hr className="my-4" />

                <button className="btn btn-primary btn-lg w-100" type="submit" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Confirmar Pedido'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA: RESUMO --- */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Resumo do Pedido</span>
                <span className="badge bg-primary rounded-pill">{cart.length} itens</span>
              </h4>
              
              <ul className="list-group mb-3">
                {cart.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-muted">Qtd: {item.quantity}</small>
                    </div>
                    <span className="text-muted">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </li>
                ))}
                
                <li className="list-group-item d-flex justify-content-between bg-light">
                  <span className="fw-bold">Total (R$)</span>
                  <strong className="text-success">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}