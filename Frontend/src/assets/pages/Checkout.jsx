import { useState, useEffect } from "react";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch cart from server on component load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data.cart);
      } catch (err) {
        console.log(err);
        alert("Could not load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (totalAmount, orderItems) => {
    try {
      // Step 1: Create payment order on backend
      const paymentOrderRes = await api.post("/payments/create-order", {
        amount: totalAmount,
        items: orderItems,
        shippingAddress: address,
      });

      if (!paymentOrderRes.data.success) {
        alert("Failed to initiate payment");
        return;
      }

      const { orderId, keyId, amount, currency } = paymentOrderRes.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "MENSWEAR",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response) => {
          // Step 3: Verify payment and create order
          try {
            const verifyRes = await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: orderItems,
              shippingAddress: address,
              totalAmount: totalAmount,
            });

            if (verifyRes.data.success) {
              const orderId = verifyRes.data.order?._id;
              navigate("/thank-you", { state: { orderId, totalAmount } });
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: address.name,
          email: user?.email,
          contact: address.phone,
        },
        theme: {
          color: "#1f2937",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const items = cart?.items || [];

      if (items.length === 0) {
        alert("Your cart is empty");
        setIsProcessing(false);
        return;
      }

      const totalAmount = items.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
      );

      const orderItems = items.map((item) => ({
        product: item.product?._id,
        name: item.product?.name,
        image: item.product?.images?.[0] || item.product?.image || "",
        price: item.product?.price,
        quantity: item.quantity,
      }));

      // Handle COD payment
      if (paymentMethod === "cod") {
        const response = await api.post("/orders", {
          items: orderItems,
          shippingAddress: address,
          paymentMethod: "cod",
          totalAmount,
        });

        if (response.data.success) {
          const orderId = response.data.order?._id || response.data.orderId;
          navigate("/thank-you", { state: { orderId, totalAmount } });
        }
      } 
      // Handle Online payment (Razorpay)
      else if (paymentMethod === "online") {
        await handleRazorpayPayment(totalAmount, orderItems);
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to place order"
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-4xl">

        <h1 className="mb-8 text-3xl font-bold">
          Checkout
        </h1>

        {loading && (
          <div className="text-center py-12">
            <p className="text-stone-600 font-semibold">Loading your cart...</p>
          </div>
        )}

        {!loading && (!cart?.items || cart.items.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <i className="fa-solid fa-bag-shopping text-4xl text-stone-300 mb-3 block" />
            <h3 className="font-serif text-2xl text-stone-800 mb-3">Your cart is empty</h3>
            <p className="text-stone-600 mb-6">Please add items to your cart before checkout.</p>
            <a href="/products" className="inline-block rounded-full bg-stone-900 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-amber-700 transition">
              Continue Shopping
            </a>
          </div>
        )}

        {!loading && cart?.items && cart.items.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 md:grid-cols-2"
        >

          {/* Address */}
          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-semibold">
              Delivery Address
            </h2>

            <input
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <textarea
              name="address"
              placeholder="Full Address"
              value={address.address}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <input
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              required
            />

          </div>

          {/* Payment */}
          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-semibold">
              Payment Method
            </h2>

            <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span>Cash on Delivery</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span>Online Payment</span>
            </label>

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-8 w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : paymentMethod === "online" ? "Proceed to Payment" : "Confirm Order"}
            </button>

          </div>

        </form>
        )}

      </div>

    </div>
  );
};

export default Checkout;