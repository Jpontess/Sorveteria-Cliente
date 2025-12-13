import React, { useState, useEffect, useMemo } from 'react';
import * as productApi from '../services/productApi';
import { ProductCard } from '../components/ProductCard';
import { socket } from '../services/socketsApi';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const responseData = await productApi.getProducts();
        
        let productsArray;
        if (responseData?.data?.produtos && Array.isArray(responseData.data.produtos)) {
          productsArray = responseData.data.produtos;
        } else if (Array.isArray(responseData)) {
          productsArray = responseData;
        } else if (responseData?.products && Array.isArray(responseData.products)) {
          productsArray = responseData.products;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          productsArray = responseData.data;
        } else {
          productsArray = [];
        }

        const availableProducts = productsArray.filter((p) => p.isAvailable);
        setProducts(availableProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
  }, []);

  // --- LÓGICA DE CATEGORIAS ---
  const categories = useMemo(() => {
    const uniqueCats = new Set(products.map(p => p.category || 'Outros'));
    const sortedCats = Array.from(uniqueCats).sort();
    return ['Todos', ...sortedCats];
  }, [products]);

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'Todos') return true;
    const prodCat = product.category || 'Outros';
    return prodCat === selectedCategory;
  });

  // --- SLIDESHOW ---
  const productsWithImages = products.filter(p => p.image && (p.image.startsWith('http') || p.image.startsWith('data:')));

  useEffect(() => {
    if (productsWithImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productsWithImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [productsWithImages]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center p-5 border border-secondary rounded bg-dark mt-4">
          <i className="bi bi-emoji-frown fs-1 text-secondary mb-3 d-block"></i>
          <h4 className="text-white">Ops! Estamos sem produtos no momento.</h4>
          <p className="text-secondary">O administrador está reabastecendo o estoque.</p>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
        return (
          <div className="text-center py-5">
            <p className="text-secondary fs-5">Nenhum produto encontrado na categoria "{selectedCategory}".</p>
            <button onClick={() => setSelectedCategory('Todos')} className="btn btn-outline-danger mt-2">
                Ver todos os produtos
            </button>
          </div>
        );
      }

    return (
      <div className="row g-4">
        {filteredProducts.map(product => (
          <div key={product._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* Hero Section */}
      <section className="position-relative py-5 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000 0%, #1a0505 100%)', borderBottom: '1px solid #333' }}>
        <div className="container px-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-danger bg-danger bg-opacity-10 text-danger small fw-bold mb-4">
                <i className="bi bi-lightning-charge-fill"></i> Delivery Expresso - 45min
              </div>
              <h1 className="display-3 fw-black text-white mb-3" style={{ fontWeight: 800 }}>SORVESAN</h1>
              <p className="lead text-secondary mb-4">
                Sorvetes de qualidade que <span className="text-danger fw-bold">derretem na boca</span>, faça logo seu pedido.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <a href="#produtos" className="btn btn-danger btn-lg px-4 py-2 fw-bold shadow-lg">Ver Cardápio</a>
              </div>
              <div className="row mt-5 pt-4 border-top border-secondary border-opacity-25">
                <div className="col-4 text-center text-lg-start">
                  <div className="h3 fw-bold text-danger mb-0">50+</div><div className="small text-secondary">Sabores</div>
                </div>
                <div className="col-4 text-center text-lg-start border-start border-end border-secondary border-opacity-25">
                  <div className="h3 fw-bold text-danger mb-0">4.9★</div><div className="small text-secondary">Avaliação</div>
                </div>
                <div className="col-4 text-center text-lg-start">
                  <div className="h3 fw-bold text-danger mb-0">2.5k+</div><div className="small text-secondary">Recomendações</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative rounded-4 overflow-hidden shadow-lg border border-danger border-opacity-25" style={{ height: '500px' }}>
                {productsWithImages.length > 0 ? (
                  <>
                    <img 
                      key={productsWithImages[currentImageIndex]._id}
                      src={productsWithImages[currentImageIndex].image} 
                      alt="Destaque" 
                      className="w-100 h-100 object-fit-cover"
                      style={{ animation: 'fadeIn 1s ease-in-out' }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                      <h3 className="text-white fw-bold mb-1">{productsWithImages[currentImageIndex].name}</h3>
                      <p className="text-danger fs-5 fw-bold mb-0">R$ {productsWithImages[currentImageIndex].price.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </>
                ) : (
                  <div className="d-flex h-100 align-items-center justify-content-center bg-dark bg-opacity-50">
                    <i className="bi bi-cone-striped text-danger opacity-50" style={{ fontSize: '8rem' }}></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lista + Filtros */}
      <section id="produtos" className="py-5">
        <div className="container px-4">
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-danger" style={{ width: '50px', height: '4px', borderRadius: '2px' }}></div>
              <h2 className="h1 fw-bold text-white mb-0">Nossos Produtos</h2>
            </div>
            <p className="text-secondary lead">Sorvetes com preço de fábrica.</p>
          </div>

          {!isLoading && products.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-4 pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn rounded-pill px-4 transition-all ${
                    selectedCategory === category 
                      ? 'btn-danger text-white' 
                      : 'btn-outline-secondary text-light border-secondary'
                  }`}
                  style={{ transition: 'all 0.3s' }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {renderContent()}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0.5; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}