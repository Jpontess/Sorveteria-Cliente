import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Removido useNavigate
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderApi';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  // Removido const navigate = useNavigate(); pois não é usado
  const [isLoading, setIsLoading] = useState(false);

  // Estado do formulário expandido para atender ao Backend
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    paymentMethod: 'PIX',
    // Campos de endereço separados
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pontoReferencia: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para buscar CEP automaticamente
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Preparar o objeto para o Backend
      // Agora enviamos o 'address' como um Objeto, não string
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        paymentMethod: formData.paymentMethod,
        totalAmount: cartTotal,
        status: 'Pendente', 
        
        // OBJETO DE ENDEREÇO (Para satisfazer o Backend)
        address: {
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          pontoReferencia: formData.pontoReferencia
        },

        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // 2. Enviar para a API
      const response = await createOrder(orderPayload);
      const savedOrder = response.data && response.data.order ? response.data.order : response; 
      const orderId = savedOrder._id || 'N/A';

      // 3. Prepara mensagem formatada para WhatsApp
      const addressString = `${formData.rua}, ${formData.numero} - ${formData.bairro}, ${formData.cidade}/${formData.estado}`;
      const cartItemsString = cart.map(item => `• ${item.quantity}x ${item.name}`).join('\n');

      const message = `Olá ${formData.customerName}, confirmo meu pedido:
      
*Id:* #${orderId.slice(-6)}
*Cliente:* ${formData.customerName}
*Endereço:* ${addressString}
*Pagamento:* ${formData.paymentMethod}
*Total:* R$ ${cartTotal.toFixed(2).replace('.', ',')}

*Itens:*
${cartItemsString}`;

      const whatsappUrl = `https://wa.me/5511992634584?text=${encodeURIComponent(message)}`;

      // 4. Finalizar
      clearCart();
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error(error);
      // Mostra a mensagem exata do erro de validação para ajudar
      alert('Erro ao finalizar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="p-5 rounded bg-dark border border-secondary shadow-lg">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h2 className="text-white mt-3">Seu carrinho está vazio 😢</h2>
          <Link to="/" className="btn btn-primary btn-lg mt-3 rounded-pill px-4">Voltar para o Cardápio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">
        
        <div className="col-md-7">
          <h2 className="text-white mb-4 d-flex align-items-center">
            <i className="bi bi-person-bounding-box me-3 text-primary"></i>
            Dados de Entrega
          </h2>
          
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-light">Nome Completo</label>
                    <input type="text" className="form-control bg-light" name="customerName" required value={formData.customerName} onChange={handleChange} placeholder="Ex: João Silva" />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-light">WhatsApp / Telefone</label>
                    <input type="text" className="form-control bg-light" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} placeholder="(11) 99999-9999" />
                  </div>

                  {/* --- BLOCO DE ENDEREÇO --- */}
                  <div className="col-md-4">
                    <label className="form-label text-light">CEP</label>
                    <input type="text" className="form-control bg-light" name="cep" required value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="00000-000" maxLength="9"/>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label text-light">Cidade</label>
                    <input type="text" className="form-control bg-light" name="cidade" required value={formData.cidade} onChange={handleChange} readOnly />
                  </div>

                  <div className="col-md-9">
                    <label className="form-label text-light">Rua / Avenida</label>
                    <input type="text" className="form-control bg-light" name="rua" required value={formData.rua} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light">Número</label>
                    <input type="text" className="form-control bg-light" name="numero" required value={formData.numero} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-light">Bairro</label>
                    <input type="text" className="form-control bg-light" name="bairro" required value={formData.bairro} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light">Estado (UF)</label>
                    <input type="text" className="form-control bg-light" name="estado" required value={formData.estado} onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-light">Complemento (Opcional)</label>
                    <input type="text" className="form-control bg-light" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Bloco, etc." />
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <label className="form-label text-light">Forma de Pagamento</label>
                  <select className="form-select form-select-lg bg-light" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
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

        {/* COLUNA DA DIREITA (RESUMO) - Mantivemos igual */}
        <div className="col-md-5">
          <h2 className="text-white mb-4 d-flex align-items-center"><i className="bi bi-basket me-3 text-primary"></i>Resumo</h2>
          <div className="card border-0 shadow-lg">
            <div className="card-body p-0"> 
              <ul className="list-group list-group-flush rounded-3">
                <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center p-3">
                  <span className="fw-bold">Itens</span>
                  <span className="badge bg-primary rounded-pill">{cart.length}</span>
                </li>
                {cart.map((item) => (
                  <li key={item._id} className="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                      <div style={{ width: '50px', height: '50px', marginRight: '15px' }} className="bg-dark border border-secondary rounded overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center">
                         {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="bi bi-image text-muted"></i>}
                      </div>
                      <div><h6 className="my-0 fw-semibold">{item.name}</h6><small className="text-muted">Qtd: {item.quantity}</small></div>
                    </div>
                    <span className="text-white fw-bold">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </li>
                ))}
                <li className="list-group-item bg-dark border-secondary p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted text-uppercase small fw-bold">Total</span>
                    <strong className="text-primary fs-3">R$ {cartTotal.toFixed(2).replace('.', ',')}</strong>
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