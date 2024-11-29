import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="logo">
                        E-Shop
                    </Link>
                    <ul className="nav-links">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/cart">Cart</Link>
                        </li>
                        <li>
                            <Link to="/orders">Orders</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
