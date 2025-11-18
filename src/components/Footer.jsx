import React from 'react';

export function Footer() {
  return (
    // 'mt-auto' força o rodapé para baixo em páginas curtas (requer flex no App.jsx)
    // 'py-3' dá um espaçamento vertical (padding)
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <span>© {new Date().getFullYear()} Loja. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}