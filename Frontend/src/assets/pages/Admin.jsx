import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState({ orders: [], productSales: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    const loadReport = async () => {
      try {
        const response = await api.get("/orders/admin-report");
        setReport(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load the admin report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [authLoading, navigate, user]);

  if (authLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-slate-50 p-10 text-center">Checking admin access...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">Store operations</p>
            <h1 className="text-4xl font-semibold text-slate-900">Admin report</h1>
            <p className="mt-2 text-slate-500">Orders and product sales at a glance.</p>
          </div>
          <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Admin view</span>
        </div>

        {loading && <p className="py-12 text-center text-slate-500">Loading report...</p>}
        {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
            <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Product sales</h2>
                <span className="text-sm text-slate-500">{report.productSales.length} products</span>
              </div>
              {report.productSales.length === 0 ? (
                <p className="text-slate-500">No sales yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {report.productSales.map((product) => (
                    <div key={product.productId} className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <p className="text-sm text-slate-500">{product.unitsSold} units sold</p>
                      </div>
                      <strong className="text-amber-700">{formatCurrency(product.revenue)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Order addresses</h2>
                <span className="text-sm text-slate-500">{report.orders.length} orders</span>
              </div>
              {report.orders.length === 0 ? (
                <p className="text-slate-500">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {report.orders.map((order) => (
                    <article key={order._id} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
                      <div className="flex flex-wrap justify-between gap-2">
                        <h3 className="font-semibold text-slate-800">{order.shippingAddress.name}</h3>
                        <span className="text-sm capitalize text-slate-500">{order.orderStatus}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">Phone: {order.shippingAddress.phone} · Total: {formatCurrency(order.totalAmount)}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}