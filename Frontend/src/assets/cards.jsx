import { useNavigate } from 'react-router-dom';

const Cards = ({ title, image, alt }) => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate(`/products?category=${encodeURIComponent(title)}`);
  };

  return (
    <article className="card-hover overflow-hidden rounded-[24px] border border-amber-100 bg-white shadow-sm">
      <img src={image} alt={alt || title} className="h-56 w-full object-cover" />
      <div className="space-y-3 p-5">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">
          Sharp cuts, premium comfort, and trend-first styling for a polished look.
        </p>
        <button 
          onClick={handleShopNow}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-400 hover:text-amber-700"
        >
          Shop now
        </button>
      </div>
    </article>
  )
}

export default Cards
