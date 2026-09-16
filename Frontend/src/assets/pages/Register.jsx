
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", data);

      console.log(response.data);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* LEFT SIDE - IMAGE */}
        <div className=" md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1787585913070-a0c497a5ff28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Welcome New User!
            </h1>

            <p className="text-gray-500 mt-2">
              Create your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <label htmlFor="name">Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="border-2 p-3 rounded-lg outline-none focus:border-blue-400"
            />
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
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-lg font-bold mt-3"
            >
              Register
            </button>

           If you already have an account then, <Link to="/login" className="text-blue-500 hover:text-blue-900">Login</Link>
          </form>

        </div>
      </div>
    </div>
  );
}

