import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderApi';


export function CheckoutPage() {
  const { cart, cartTotal, clearCart, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    paymentMethod: 'PIX',
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
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
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

      const response = await createOrder(orderPayload);
      const savedOrder = response.data && response.data.order ? response.data.order : response;
      const orderId = savedOrder._id || 'N/A';

      const addressString = `${formData.rua}, ${formData.numero} - ${formData.bairro}, ${formData.cidade}/${formData.estado}`;
      const cartItemsString = cart.map(item => `• ${item.quantity}x ${item.name}`).join('\n');

      const message = `Olá meu nome é ${formData.customerName}, segue meu pedido:
      
*Id:* #${orderId.slice(-6)}
*Cliente:* ${formData.customerName}
*Endereço:* ${addressString}
*Pagamento:* ${formData.paymentMethod}
*Total:* R$ ${cartTotal.toFixed(2).replace('.', ',')}

*Itens:*
${cartItemsString}`;

      const whatsappUrl = `https://wa.me/5511992634584?text=${encodeURIComponent(message)}`;

      clearCart();
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar pedido: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const darkCardStyle = {
    backgroundColor: '#18181b', // Zinc-900
    border: '1px solid rgba(220, 53, 69, 0.2)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
  };

  if (cart.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: '#000' }}>
        <div className="card text-center p-5" style={darkCardStyle}>
          <div className="mb-4">
            <i className="bi bi-bag-x text-danger" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
          </div>
          <h2 className="text-white fw-bold mb-3">Carrinho Vazio</h2>
          <p className="text-secondary mb-4">Adicione produtos deliciosos para continuar!</p>
          <Link to="/" className="btn btn-danger btn-lg fw-bold">
            <i className="bi bi-arrow-left me-2"></i> Voltar ao Cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }} className="pb-5">
      
      {/* Header Local Simples (Link Voltar) */}
      <div className="container pt-4 pb-4">
        <Link to="/" className="btn btn-outline-secondary text-light border-0">
          <i className="bi bi-arrow-left me-2"></i> Voltar ao Cardápio
        </Link>
      </div>

      <div className="container">
        <div className="row g-4">
          
          {/* --- COLUNA DA ESQUERDA: FORMULÁRIO --- */}
          <div className="col-lg-8">
            
            {/* Card Dados Pessoais */}
            <div className="card mb-4" style={darkCardStyle}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <h4 className="card-title text-white d-flex align-items-center gap-2">
                  <i className="bi bi-person text-danger"></i> Dados Pessoais
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-secondary small">Nome Completo *</label>
                    <input type="text" className="form-control" name="customerName" required value={formData.customerName} onChange={handleChange} placeholder="Ex: João Silva"/>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary small">WhatsApp / Telefone *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark text-secondary border-danger border-opacity-25"><i className="bi bi-telephone"></i></span>
                      <input type="text" className="form-control" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} placeholder="(11) 99999-9999"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Endereço */}
            <div className="card mb-4" style={darkCardStyle}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <h4 className="card-title text-white d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt text-danger"></i> Endereço de Entrega
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label text-secondary small">CEP *</label>
                    <input type="text" className="form-control" name="cep" required value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="00000-000" maxLength="9"/>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label text-secondary small">Cidade *</label>
                    <input type="text" className="form-control" name="cidade" required value={formData.cidade} onChange={handleChange} />
                  </div>

                  <div className="col-md-9">
                    <label className="form-label text-secondary small">Rua / Avenida *</label>
                    <input type="text" className="form-control" name="rua" required value={formData.rua} onChange={handleChange}/>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Número *</label>
                    <input type="text" className="form-control" name="numero" required value={formData.numero} onChange={handleChange}/>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Bairro *</label>
                    <input type="text" className="form-control" name="bairro" required value={formData.bairro} onChange={handleChange}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Estado *</label>
                    <input type="text" className="form-control" name="estado" required value={formData.estado} onChange={handleChange}/>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary small">Complemento</label>
                    <input type="text" className="form-control" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Bloco, etc."/>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Pagamento */}
            <div className="card" style={darkCardStyle}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <h4 className="card-title text-white d-flex align-items-center gap-2">
                  <i className="bi bi-credit-card text-danger"></i> Pagamento
                </h4>
              </div>
              <div className="card-body p-4">
                <select className="form-select form-select-lg" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="PIX">PIX</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão">Cartão</option>
                </select>
              </div>
            </div>

          </div>

          {/* --- COLUNA DA DIREITA: RESUMO --- */}
          <div className="col-lg-4">
            <div className="card sticky-top" style={{ top: '20px', ...darkCardStyle }}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <h4 className="card-title text-white d-flex align-items-center gap-2 mb-0">
                  <i className="bi bi-bag text-danger"></i> Resumo
                </h4>
                <span className="badge bg-danger">{cart.length} itens</span>
              </div>
              
              <div className="card-body p-4">
                <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div key={item._id} className="d-flex gap-3 align-items-center p-2 rounded hover-bg-dark">
                      
                      {/* Imagem Miniatura */}
                      <div className="rounded bg-black border border-secondary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', overflow: 'hidden', flexShrink: 0 }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <i className="bi bi-image text-secondary"></i>
                        )}
                      </div>

                      {/* Info Produto */}
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <h6 className="text-white mb-0 text-truncate">{item.name}</h6>
                        <small className="text-secondary">Qtd: {item.quantity}</small>
                        <div className="text-danger fw-bold small">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        className="btn btn-link text-danger p-0" 
                        onClick={() => removeFromCart(item._id)}
                        title="Remover"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary">Subtotal</span>
                  <span className="text-white">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-secondary">Entrega</span>
                  <span className="text-success fw-bold">A calcular</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 pt-3 border-top border-secondary">
                  <span className="text-white h5 mb-0">Total</span>
                  <span className="text-success h4 mb-0 fw-bold">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>

                <button 
                  className="btn btn-danger btn-lg w-100 fw-bold shadow-lg" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span><i className="spinner-border spinner-border-sm me-2"></i> Enviando...</span>
                  ) : (
                    <span><i className="bi bi-whatsapp me-2"></i> Confirmar Pedido</span>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}