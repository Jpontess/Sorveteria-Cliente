import { AppRoutes } from './routes/appRoutes';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';
// (No futuro, o Navbar do cliente pode vir aqui)

export function App() {
  return (
    < CartProvider>    
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}