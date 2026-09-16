
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './assets/context/AuthContext.jsx'
import { CartProvider } from './assets/context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
)
