import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Removido useNavigate
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderApi';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  // 2. Removido const navigate = useNavigate(); pois não é usado
  const [isLoading, setIsLoading] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    paymentMethod: 'PIX', 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        totalAmount: cartTotal,
        status: 'Pendente', 
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // 1. Envia para a API e AGUARDA a resposta (para pegar o ID)
      const response = await createOrder(orderPayload);
      
      // O backend retorna: { status: 'Sucesso', data: { order: { _id: '...', ... } } }
      const savedOrder = response.data && response.data.order ? response.data.order : response; 
      const orderId = savedOrder._id || 'N/A';

      // 2. Prepara a mensagem do WhatsApp
      const cartItemsString = cart
        .map(item => `• ${item.quantity}x ${item.name}`)
        .join('\n');

      const message = `Olá, você poderia confirmar o meu pedido?
      
*Id:* #${orderId.slice(-6)}
*Nome Cliente:* ${formData.customerName}
*Endereço:* ${formData.address}
*Pagamento:* ${formData.paymentMethod}
*Valor do Produto:* R$ ${cartTotal.toFixed(2).replace('.', ',')}
*Taxa de entrega:* Pendente


*Itens:*
${cartItemsString}

*Valor final:* Pendente`;

      // 3. Codifica a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      
      // SEU NÚMERO DE TELEFONE (Admin)
      const adminPhone = "5511995316895"; 
      
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

      // 4. Limpa o carrinho
      clearCart();

      // 5. Redireciona para o WhatsApp
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar pedido: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Se o carrinho estiver vazio
  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="p-5 rounded bg-dark border border-secondary shadow-lg">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h2 className="text-white mt-3">Seu carrinho está vazio</h2>
          <p className="lead text-muted">Adicione alguns sorvetes deliciosos antes de finalizar.</p>
          <Link to="/" className="btn btn-primary btn-lg mt-3 rounded-pill px-4">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar para o Cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">
        
        {/* --- COLUNA DA ESQUERDA: FORMULÁRIO --- */}
        <div className="col-md-7">
          <h2 className="text-white mb-4 d-flex align-items-center">
            <i className="bi bi-person-bounding-box me-3 text-primary"></i>
            Dados de Entrega
          </h2>
          
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label text-light">Nome Completo</label>
                  <input type="text" className="form-control form-control-lg bg-light" id="customerName" name="customerName" required value={formData.customerName} onChange={handleChange} placeholder="Ex: João Silva" />
                </div>

                <div className="mb-3">
                  <label htmlFor="customerPhone" className="form-label text-light">WhatsApp / Telefone</label>
                  <input type="text" className="form-control form-control-lg bg-light" id="customerPhone" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} placeholder="Ex: (11) 99999-9999" />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label text-light">Endereço de Entrega</label>
                  <textarea className="form-control form-control-lg bg-light" id="address" name="address" rows="3" required value={formData.address} onChange={handleChange} placeholder="Rua, Número, Bairro e Complemento"></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="form-label text-light">Forma de Pagamento</label>
                  <select className="form-select form-select-lg bg-light" id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>

                <button className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span><i className="bi bi-hourglass-split me-2"></i>Enviando...</span>
                  ) : (
                    <span><i className="bi bi-whatsapp me-2"></i>Confirmar no WhatsApp</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA: RESUMO --- */}
        <div className="col-md-5">
          <h2 className="text-white mb-4 d-flex align-items-center">
            <i className="bi bi-basket me-3 text-primary"></i>
            Resumo
          </h2>

          <div className="card border-0 shadow-lg">
            <div className="card-body p-0"> 
              
              <ul className="list-group list-group-flush rounded-3">
                <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center p-3">
                  <span className="fw-bold">Itens no Carrinho</span>
                  <span className="badge bg-primary rounded-pill">{cart.length}</span>
                </li>

                {cart.map((item) => (
                  <li key={item._id} className="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                      <div style={{ width: '50px', height: '50px', marginRight: '15px' }} className="bg-dark border border-secondary rounded overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center">
                         {item.image ? (
                           <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         ) : (
                           <i className="bi bi-image text-muted" style={{ fontSize: '1.2rem' }}></i>
                         )}
                      </div>
                      <div>
                        <h6 className="my-0 fw-semibold">{item.name}</h6>
                        <small className="text-primary">Qtd: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="text-white fw-bold">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </li>
                ))}
                
                <li className="list-group-item bg-dark border-secondary p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-white text-uppercase small fw-bold">Total a Pagar:</span>
                    <strong className="text-success fs-3">
                      R$ {cartTotal.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}