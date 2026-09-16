import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const response = await api.post("/auth/login", data);
        const { user, token } = response.data;
        login(user, token);
        navigate(user.role === "admin" ? "/admin" : "/products");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* LEFT SIDE - IMAGE */}
        <div className=" md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1787585913070-a0c497a5ff28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-gray-500 mt-2">Login to your account</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="border-2 p-3 rounded-lg outline-none focus:border-blue-400"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="border-2 p-3 rounded-lg outline-none focus:border-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-lg font-bold mt-3 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-900">
              Register
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
