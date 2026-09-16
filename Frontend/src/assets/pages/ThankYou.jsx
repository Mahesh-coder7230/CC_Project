import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-check text-4xl text-green-600"></i>
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          Thank You!
        </h1>
        <p className="text-lg text-stone-600 mb-6">
          Your order has been successfully placed.
        </p>

        {/* Order Details */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-8">
          <div className="mb-4">
            <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">
              Order ID
            </p>
            <p className="text-2xl font-bold text-stone-900 break-all">
              {orderId || "N/A"}
            </p>
          </div>

          {totalAmount && (
            <div className="border-t border-stone-200 pt-4">
              <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">
                Total Amount
              </p>
              <p className="text-xl font-bold text-amber-700">
                ₹{Number(totalAmount).toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            <i className="fa-solid fa-info-circle mr-2"></i>
            A confirmation email has been sent to your registered email address.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/products"
            className="w-full rounded-full bg-stone-900 text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-amber-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="w-full rounded-full border-2 border-stone-900 text-stone-900 py-3 text-sm font-bold uppercase tracking-wider hover:bg-stone-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
