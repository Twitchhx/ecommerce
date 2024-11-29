import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`}>
                <img
                    src={product.imageUrl || '/ecommerce-frontend/src/assets/images/product-placeholder.png'}
                    alt={product.title}
                    className="product-image"
                />
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
            </Link>
            <button className="btn btn-primary">Add to Cart</button>
        </div>
    );
};

export default ProductCard;
