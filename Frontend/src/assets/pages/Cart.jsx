import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data.cart);
      const items = res.data.cart?.items || [];
      updateCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Could not load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data.cart);
      const items = res.data.cart?.items || [];
      updateCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Could not update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data.cart);
      const items = res.data.cart?.items || [];
      updateCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Could not remove item.");
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete("/cart");
      setCart(res.data.cart);
      updateCartCount(0);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Could not clear cart.");
    }
  };

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      <section className="bg-stone-200 border-b border-stone-300 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
            Your Bag
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-stone-900 leading-tight">
            Shopping <em className="italic text-amber-700 font-normal">Cart</em>
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <p className="text-xs font-semibold tracking-wider uppercase text-stone-400">
            Loading your cart...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <i className="fa-solid fa-bag-shopping text-4xl text-stone-300 mb-3 block" />
            <h3 className="font-serif text-2xl text-stone-800">Your bag is empty</h3>
            <p className="text-sm text-stone-500 mt-1">
              Browse our collection and add something you love.
            </p>
            <Link
              to="/products"
              className="inline-block mt-6 rounded-full bg-stone-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition"
            >
              Shop Products
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items list */}
            <div className="lg:col-span-2 divide-y divide-stone-200">
              {items.map((item) => {
                const product = item.product || {};
                const imageSrc = product.images?.[0] || product.image;

                return (
                  <div key={product._id} className="flex gap-4 py-6">
                    <div className="w-24 h-28 bg-stone-200 rounded-sm overflow-hidden flex-shrink-0">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h2 className="text-sm font-semibold text-stone-900">
                            {product.name}
                          </h2>
                          <p className="text-xs text-stone-500 mt-1">
                            {product.category}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(product._id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-stone-400 hover:text-red-500 transition"
                        >
                          <i className="fa-solid fa-trash text-sm" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 border border-stone-300 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            className="text-stone-600 hover:text-amber-700 w-5"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, item.quantity + 1)}
                            className="text-stone-600 hover:text-amber-700 w-5"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-bold text-amber-700">
                          {formatPrice(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-6">
                <button
                  onClick={clearCart}
                  className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-red-500 transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="border border-stone-300 rounded-sm p-6 h-fit">
              <h3 className="font-serif text-2xl text-stone-900 mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm text-stone-600 mb-2">
                <span>Items</span>
                <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-4 mt-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button type="button" onClick={() => navigate('/checkout')} className="w-full mt-6 rounded-full bg-stone-900 text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
