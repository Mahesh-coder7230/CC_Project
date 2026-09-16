import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  category: "Order issue",
  complaint: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSubmitted(false);
  };

  const submitComplaint = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section className="border-b border-stone-300 pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">We are here to help</p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">Contact us</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">
            Tell us what happened and our support team will review your complaint and get back to you.
          </p>
          <div className="mt-10 space-y-5 text-sm text-stone-600">
            <a className="flex items-center gap-3 hover:text-amber-700" href="tel:+912200700700">
              <i className="fa-solid fa-phone text-amber-700" />
              +91 22 0070 0700
            </a>
            <a className="flex items-center gap-3 hover:text-amber-700" href="mailto:support@younique.in">
              <i className="fa-solid fa-envelope text-amber-700" />
              support@younique.in
            </a>
            <p className="flex gap-3 leading-6">
              <i className="fa-solid fa-location-dot mt-1 text-amber-700" />
              Shop 09, Kasturi Heights 06, Indralok Phase 4, Bandra West, Maharashtra 400050
            </p>
          </div>
        </section>

        <section className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Submit a complaint</h2>
            <p className="mt-2 text-sm text-stone-600">Please include your order details where relevant.</p>
          </div>
          {submitted && (
            <div className="mb-6 border border-green-200 bg-green-50 p-4 text-sm text-green-800" role="status">
              Thanks. Your complaint has been recorded and our team will contact you soon.
            </div>
          )}
          <form onSubmit={submitComplaint} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700">
                Full name
                <input name="name" value={form.name} onChange={updateField} required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700" />
              </label>
              <label className="text-sm font-medium text-stone-700">
                Email address
                <input type="email" name="email" value={form.email} onChange={updateField} required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700" />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700">
                Phone number
                <input type="tel" name="phone" value={form.phone} onChange={updateField} required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700" />
              </label>
              <label className="text-sm font-medium text-stone-700">
                Complaint type
                <select name="category" value={form.category} onChange={updateField} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700">
                  <option>Order issue</option>
                  <option>Product quality</option>
                  <option>Delivery problem</option>
                  <option>Payment issue</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium text-stone-700">
              Complaint details
              <textarea name="complaint" value={form.complaint} onChange={updateField} required rows="6" className="mt-2 w-full resize-y border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700" placeholder="Tell us how we can help..." />
            </label>
            <button type="submit" className="bg-stone-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-amber-700">
              Submit complaint
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
