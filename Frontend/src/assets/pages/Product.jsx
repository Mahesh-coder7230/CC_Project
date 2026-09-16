import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../context/AuthContext.jsx";

// 1. Fallback Products Data
const FALLBACK_PRODUCTS = [
  { _id: "shirt", name: "Riviera Linen Shirt", price: 1899, category: "Shirts", description: "Breathable linen with an easy, polished drape.", image: "/src/assets/images/shirts.jpg" },
  { _id: "tee", name: "Essential Heavyweight Tee", price: 899, category: "T-shirts", description: "A substantial cotton tee for every rotation.", image: "/src/assets/images/T-shirts/tshirts.jpeg" },
  { _id: "polo", name: "Sandstone Knit Polo", price: 1499, category: "Polos", description: "Textured knit comfort with a smart open collar.", image: "/src/assets/images/polos.jpg" },
  { _id: "jeans", name: "Atlas Straight Jeans", price: 2299, category: "Jeans", description: "A classic straight fit in soft, washed denim.", image: "/src/assets/images/jeans.jpg" },
  { _id: "trouser", name: "Everyday Tailored Trouser", price: 1999, category: "Trousers", description: "Clean lines and a little stretch for long days.", image: "/src/assets/images/Trouser/trousers1.jpeg" },
  { _id: "formal", name: "The Evening Formal", price: 3499, category: "Formals", description: "A refined silhouette for moments that matter.", image: "/src/assets/images/formal/formal1.jpeg" },
];

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

export default function Products() {
  // 2. Component State
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [bagCount, setBagCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const { user } = useAuth();
  const navigate = useNavigate();

  // 2b. Read category from URL query params on component load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // 3. Fetch from API with Fallback
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.log("Using fallback data:", err.message))
      .finally(() => setLoading(false));
  }, []);

  // 3b. If logged in, load the real bag count from the user's cart in MongoDB
  useEffect(() => {
    if (!user) {
      setBagCount(0);
      return;
    }

    api
      .get("/cart")
      .then((res) => {
        const items = res.data.cart?.items || [];
        setBagCount(items.reduce((sum, item) => sum + item.quantity, 0));
      })
      .catch((err) => console.log(err));
  }, [user]);

  // 3c. Add a product to the logged-in user's cart
  const addToBag = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await api.post("/cart", { productId, quantity: 1 });
      const items = res.data.cart?.items || [];
      setBagCount(items.reduce((sum, item) => sum + item.quantity, 0));
      alert("Item added to cart!");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Could not add item to bag.");
    }
  };

  // 4. Extract Unique Categories
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...unique];
  }, [products]);

  // 5. Filter & Sort Logic
  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === "All" || product.category?.toLowerCase() === selectedCategory.toLowerCase();
        const text = `${product.name} ${product.description || ""} ${product.category || ""}`.toLowerCase();
        const matchesSearch = text.includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);
  
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Hero Banner */}
      <section className="bg-stone-200 border-b border-stone-300 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
              The New Collection / 2026
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl text-stone-900 leading-tight">
              The art of <em className="italic text-amber-700 font-normal">everyday style.</em>
            </h1>
            <p className="mt-4 text-sm text-stone-600 max-w-md">
              Thoughtful essentials and considered layers for the way you actually live.
            </p>
          </div>

          <div className="border-l border-stone-400 pl-4">
            <span className="font-serif text-4xl block text-stone-900">{products.length}</span>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Pieces to discover
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter, Search & Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-300 py-6">
          {/* Category Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "border-amber-700 text-amber-700"
                    : "border-transparent text-stone-500 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 border-b border-stone-400 pb-1 text-stone-500">
              <i className="fa-solid fa-magnifying-glass text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm outline-none placeholder:text-stone-400 w-36 sm:w-48"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-wider text-stone-600 outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Count & Bag Status */}
        <div className="flex items-center justify-between py-6">
          <p className="text-sm text-stone-500">
            <strong className="text-stone-900">{visibleProducts.length}</strong> items available
          </p>

          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <i className="fa-solid fa-bag-shopping" />
            {bagCount > 0 ? `Bag (${bagCount})` : "Bag is empty"}
          </p>
        </div>

        {loading && (
          <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 mb-6">
            Loading products...
          </p>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
          {visibleProducts.map((product, index) => {
            const imageSrc =
              product.images?.[0] || product.image || FALLBACK_PRODUCTS[index % FALLBACK_PRODUCTS.length].image;

            return (
              <article key={product._id || product.name} className="group flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-200 rounded-sm">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <span className="absolute top-2 left-2 bg-stone-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm">
                    {index < 2 ? "New in" : product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="pt-3 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-sm font-semibold text-stone-900 line-clamp-1">{product.name}</h2>
                    <button
                      aria-label={`Save ${product.name}`}
                      className="text-stone-400 hover:text-red-500 transition"
                    >
                      <i className="fa-regular fa-heart text-sm" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-1 mt-1">{product.description}</p>
                  <p className="text-sm font-bold text-amber-700 mt-2">{formatPrice(product.price)}</p>

                  <button
                    onClick={() => addToBag(product._id)}
                    aria-label={`Add ${product.name} to bag`}
                    className="mt-3 w-full rounded-full bg-stone-900 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition"
                  >
                    Add To Cart
                  </button>
                </div>

              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {visibleProducts.length === 0 && (
          <div className="text-center py-20">
            <i className="fa-solid fa-shirt text-4xl text-stone-300 mb-3 block" />
            <h3 className="font-serif text-2xl text-stone-800">No items found</h3>
            <p className="text-sm text-stone-500 mt-1">Try adjusting your search query or selected category.</p>
          </div>
        )}
      </section>
    </main>
  );
}