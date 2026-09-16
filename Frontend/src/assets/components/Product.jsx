import { useEffect, useState } from "react";
import api from "../../api.js";


function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className = 'size-96 bg-slate-100 grid grid-cols-3 gap-4 p-4'>
      {products.map((product) => (
        <div key={product._id}>
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>₹{product.price}</p>
          <p>{product.description}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Products;