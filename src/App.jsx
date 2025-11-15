import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('carregando...');
  

  
  const API_URL = "https://sorveteria-backend-h7bw.onrender.com"; 
  
  useEffect(() => {
    // Função para "bater" na nossa API e testar a conexão
    const checkApiHealth = async () => {
      try {
        // Usamos a rota /api/health que criamos no backend
        const response = await fetch(`${API_URL}/api/health`);
        
        if (!response.ok) {
          // Se o Render respondeu, mas deu erro (ex: 500)
          throw new Error(`API fora do ar ou com erro (Status: ${response.status})`);
        }

        const data = await response.json();
        
        // Se deu tudo certo, atualiza o status
        setApiStatus(`✅ ${data.message}`);

      } catch (error) {
        // Se não conseguiu nem conectar (ex: CORS ou rede)
        console.error('Erro ao conectar na API:', error.message);
        setApiStatus(`❌ Erro ao conectar na API: ${error.message}`);
      }
    };

    // Chama a função assim que o componente é montado
    checkApiHealth();
  }, [API_URL]); // O array vazio [] faz isso rodar só uma vez

  return (
    <div className="container">
      <h1>App do Cliente (Sorvesan Zélia)</h1>
      <p>Status da API (Backend):</p>
      
      {/* Mostra o status que buscamos da API */}
      <div className="status-box">
        {apiStatus}
      </div>
    </div>
  );
}

export default App;