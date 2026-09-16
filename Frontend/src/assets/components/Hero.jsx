import Cards from '../cards.jsx'
import { useNavigate } from 'react-router-dom'
const Hero = () => {
  const navigate = useNavigate()
  const demo = [
    {
      title: 'SHIRTS',
      image: 'https://ik.imagekit.io/fb9burymd/shirts.jpg',
      alt: 'Shirts'
    },
    {
      title: 'T-SHIRTS',
      image: 'https://ik.imagekit.io/fb9burymd/tshirts.jpeg',
      alt: 'T-shirts'
    },
    {
      title: 'POLO SHIRTS',
      image: 'https://ik.imagekit.io/fb9burymd/polos.jpg',
      alt: 'Polos'
    },
    {
      title: 'JEANS',
      image: 'https://ik.imagekit.io/fb9burymd/jeans.jpg',
      alt: 'Jeans'
    },
    {
      title: 'TROUSERS',
      image: 'https://ik.imagekit.io/fb9burymd/trousers.jpg',
      alt: 'Trousers'
    },
    {
      title: 'FORMAL WEAR',
      image: 'https://ik.imagekit.io/fb9burymd/hero.png',
      alt: 'Formal Wear'
    }
  ]
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid items-center gap-8 overflow-hidden rounded-4xl border border-amber-200/80 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-10 xl:p-12">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ">
            <span className="mr-2 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            New season essentials
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Elegant men's wear for every moment.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Discover refined shirts, polos, jeans, and formalwear crafted for comfort, confidence, and timeless style.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/products")} className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-600">
              Explore collection
            </button>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-2">Free shipping over ₹1,149</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Premium fabrics</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Fresh arrivals</span>
          </div>
        </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-amber-200/70 via-orange-100/40 to-transparent blur-3xl" />
            <img src="https://ik.imagekit.io/fb9burymd/hero.png" alt="Stylish clothing display" className="relative w-full rounded-[28px] border border-white/70 object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Featured Picks</p>
            <h2 className="text-3xl font-semibold text-slate-900">Curated styles for every occasion</h2>
          </div>
          <a href="#" className="text-sm font-medium text-slate-700 underline decoration-amber-400 underline-offset-4 hover:text-amber-700">
            View all categories
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {demo.map((item) => (
            <Cards key={item.title} title={item.title} image={item.image} alt={item.alt} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Hero
