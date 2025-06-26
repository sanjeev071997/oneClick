import { useLocation } from "react-router-dom";


const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.product;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: ₹{product.price}</p>
      <p>Details: {product.details}</p>
    
    </div>
  );
};

export default ProductDetails;
