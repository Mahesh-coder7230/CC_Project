import { useEffect, useState } from "react";
import api from "../../api.js";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await api.get("/products/new-arrivals");

        setProducts(res.data);
      } catch (error) {
        setError("New arrivals are temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-b border-stone-300 pb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">Just landed</p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">New arrivals</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">Fresh cuts, new textures, and considered pieces for the season ahead.</p>
        </div>
        {loading && <p className="text-sm uppercase tracking-wider text-stone-500">Loading new arrivals...</p>}
        {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && <p className="text-sm text-stone-600">No new arrivals are available right now.</p>}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product._id} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone-200">
                  <img src={product.images?.[0] || product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-700">{product.category}</p>
                <h2 className="mt-1 text-lg font-semibold text-stone-900">{product.name}</h2>
                <p className="mt-2 text-sm text-stone-600">₹{Number(product.price).toLocaleString("en-IN")}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}