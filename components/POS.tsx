import React, { useState, useMemo, useContext } from 'react';
import { ERPContext } from '../App';
import { OrderItem, Product, PaymentMode } from '../types';
import Modal from './common/Modal';

const POS: React.FC = () => {
    const context = useContext(ERPContext);
    const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.CASH);

    if (!context) return <div>Loading...</div>;
    const { data, actions } = context;

    const categories = useMemo(() => ['All', ...new Set(data.products.map(p => p.category))], [data.products]);
    
    const productsToShow = useMemo(() => {
        let filteredProducts = data.products;
        if (selectedCategory !== 'All') {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return filteredProducts;
    }, [selectedCategory, data.products, searchTerm]);

    const addToOrder = (product: Product) => {
        setCurrentOrder(prevOrder => {
            const existingItem = prevOrder.find(item => item.productId === product.id);
            if (existingItem) {
                return prevOrder.map(item =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevOrder, { productId: product.id, quantity: 1, price: product.price }];
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            setCurrentOrder(prev => prev.filter(item => item.productId !== productId));
        } else {
            setCurrentOrder(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
        }
    };
    
    const orderDetails = useMemo(() => {
        const subTotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subTotal * 0.08; // 8% tax
        const total = subTotal + tax;
        return { subTotal, tax, total };
    }, [currentOrder]);
    
    const handleCheckout = () => {
        if (currentOrder.length === 0) return;
        setCheckoutModalOpen(true);
    };

    const confirmOrder = () => {
        const newOrder = {
            items: currentOrder,
            subTotal: orderDetails.subTotal,
            tax: orderDetails.tax,
            discount: 0,
            total: orderDetails.total,
            paymentMode: paymentMode
        };
        actions.createOrder(newOrder);
        setCurrentOrder([]);
        setCheckoutModalOpen(false);
    };

    return (
        <div className="flex flex-col lg:flex-row p-4 gap-4">
            {/* Products Panel */}
            <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 flex flex-col">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
                <div className="relative mb-4">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="mb-4">
                    <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                    {productsToShow.map(product => (
                        <div key={product.id} onClick={() => addToOrder(product)}
                            className="bg-slate-50 border rounded-lg shadow-sm p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200">
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <p className="text-gray-500 text-sm">{product.category}</p>
                            <p className="text-lg font-semibold text-blue-600 mt-2">₹{product.price.toFixed(2)}</p>
                            <p className={`text-xs font-semibold ${product.stock > product.lowStockThreshold ? 'text-green-500' : 'text-red-500'}`}>
                                Stock: {product.stock}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Panel */}
            <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow-md flex flex-col text-gray-800">
                <h2 className="text-3xl font-bold border-b pb-4">Current Order</h2>
                <div className="flex-1 overflow-y-auto my-4">
                    {currentOrder.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Your order is empty.</p>
                    ) : (
                        currentOrder.map(item => {
                            const product = data.products.find(p => p.id === item.productId);
                            if (!product) return null;
                            return (
                                <div key={item.productId} className="flex items-center justify-between py-3 border-b">
                                    <div>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center border rounded-md">
                                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors">
                                                <i className="fas fa-minus text-xs"></i>
                                            </button>
                                            <span className="px-3 font-semibold text-center w-12 bg-white">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors">
                                                <i className="fas fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                        <p className="font-bold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => updateQuantity(item.productId, 0)} className="text-red-500 hover:text-red-700">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="border-t pt-4 space-y-2 text-lg">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{orderDetails.subTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span>₹{orderDetails.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-2xl mt-2"><span>Total</span><span>₹{orderDetails.total.toFixed(2)}</span></div>
                    <button onClick={handleCheckout} disabled={currentOrder.length === 0}
                        className="w-full bg-green-500 text-white py-3 mt-4 rounded-lg text-xl font-bold shadow-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Checkout
                    </button>
                </div>
            </div>
            
            <Modal isOpen={isCheckoutModalOpen} onClose={() => setCheckoutModalOpen(false)} title="Complete Order">
                 <div className="space-y-4">
                    <p className="text-center text-4xl font-bold text-gray-800">₹{orderDetails.total.toFixed(2)}</p>
                    <div className="flex justify-center space-x-2 py-4">
                        {Object.values(PaymentMode).map(mode => (
                            <button key={mode} onClick={() => setPaymentMode(mode)}
                                className={`px-6 py-3 rounded-lg font-semibold transition ${paymentMode === mode ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                {mode}
                            </button>
                        ))}
                    </div>
                    <button onClick={confirmOrder} className="w-full bg-green-500 text-white py-3 mt-4 rounded-lg text-xl font-bold shadow-lg hover:bg-green-600">
                        Generate Invoice
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default POS;