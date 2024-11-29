import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import NotFound from './components/NotFound'; // Create a NotFound component for undefined routes

const App = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products" element={<ProductList />} />
                    {/* Add more routes as needed */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
