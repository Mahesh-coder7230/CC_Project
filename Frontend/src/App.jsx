import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './assets/components/Navbar.jsx'
import Hero from './assets/components/Hero.jsx'
import Footer from './assets/components/Footer.jsx'
import Product from './assets/pages/Product.jsx'
import Register from './assets/pages/Register.jsx'
import Login from './assets/pages/Login.jsx'
import Cart from './assets/pages/Cart.jsx'
import NewArrivals from './assets/pages/Newarrivals.jsx'
import Checkout from "./assets/pages/Checkout.jsx";
import ThankYou from "./assets/pages/ThankYou.jsx";
import Admin from "./assets/pages/Admin.jsx";
import Contact from "./assets/pages/Contact.jsx";
import './index.css'

const App = () => {
  return (
    <div className="min-h-screen">
        <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Hero />}
        />

        <Route
          path="/products"
          element={<Product />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/newarrivals"
          element={<NewArrivals />}
        />
        <Route
          path="/checkout"
          element={<Checkout />}
        />
        <Route
          path="/thank-you"
          element={<ThankYou />}
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  )
}

export default App
