import '@fortawesome/fontawesome-free/css/all.min.css'
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { bagCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <img src="https://ik.imagekit.io/fb9burymd/logo.jpg" alt="Logo" className="h-14 w-14 rounded-full border border-amber-200 object-cover shadow-sm" />
          <div>
            <p className="text-lg font-semibold tracking-[0.2em] text-slate-900">MENSWEAR</p>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-600">Style redefined</p>
          </div>
        </a>

        <ul className=" items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <li><Link to="/" className="transition hover:text-amber-600 transition hover:border-b-2">Home</Link></li>
          <li><Link to="/products" className="transition hover:text-amber-600 transition hover:border-b-2">Products</Link></li>
          <li><Link to="/newarrivals" className="transition hover:text-amber-600 transition hover:border-b-2">New Arrivals</Link></li>
          <li><Link to="/contact" className="transition hover:text-amber-600 hover:border-b-2">Contact</Link></li>
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full bg-slate-900 p-2.5 text-white shadow-sm transition hover:bg-amber-600">
            <i className="fa-solid fa-bag-shopping"></i>
            {bagCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {bagCount}
              </span>
            )}
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              title={user ? user.name : "Account"}
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm"
            >
              <i className="fa-solid fa-circle-user"></i>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">

                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="block rounded-lg px-3 py-2 text-amber-700 hover:bg-amber-50"
                      >
                        <i className="fa-solid fa-chart-line mr-2"></i>
                        Admin report
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 mt-1 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                      <i className="fa-solid fa-right-to-bracket mr-2"></i>
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                      <i className="fa-solid fa-user-plus mr-2"></i>
                      Register
                    </Link>
                  </>
                )}

              </div>
            )}
          </div>
        </div>
      </nav>

      <marquee className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 px-4 py-2 text-sm font-medium text-slate-700" scrollamount="16" direction="left" behavior="scroll">
        50% off on all products! • Shop now • Free shipping on orders over ₹1,149 • Limited-time offer • New arrivals just in
      </marquee>
    </header>
  )
}

export default Navbar
