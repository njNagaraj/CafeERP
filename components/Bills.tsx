// Create the Bills component to display order history.
import React, { useContext, useState } from 'react';
import { ERPContext } from '../App';
import Modal from './common/Modal';
import { Order } from '../types';

const Bills: React.FC = () => {
    const context = useContext(ERPContext);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    if (!context) return <div>Loading...</div>;
    const { data } = context;

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">All Bills</h1>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Order ID</th>
                            <th className="p-4 font-semibold">Date & Time</th>
                            <th className="p-4 font-semibold">Items</th>
                            <th className="p-4 font-semibold">Total Amount</th>
                            <th className="p-4 font-semibold">Payment Mode</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...data.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 whitespace-nowrap">{order.id}</td>
                                <td className="p-4 whitespace-nowrap">{order.createdAt.toLocaleString()}</td>
                                <td className="p-4 whitespace-nowrap">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                <td className="p-4 font-semibold whitespace-nowrap">₹{order.total.toFixed(2)}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        order.paymentMode === 'Card' ? 'bg-blue-100 text-blue-800' :
                                        order.paymentMode === 'UPI' ? 'bg-purple-100 text-purple-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {order.paymentMode}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleViewOrder(order)} className="text-blue-500 hover:text-blue-700">
                                        <i className="fas fa-eye mr-1"></i> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <Modal isOpen={!!selectedOrder} onClose={handleCloseModal} title={`Order Details: ${selectedOrder.id}`}>
                    <div className="space-y-4">
                        <div>
                            <strong>Date:</strong> {selectedOrder.createdAt.toLocaleString()}
                        </div>
                        <div className="border-t pt-2">
                            <h4 className="font-semibold mb-2">Items:</h4>
                            <ul>
                                {selectedOrder.items.map(item => {
                                    const product = data.products.find(p => p.id === item.productId);
                                    return (
                                        <li key={item.productId} className="flex justify-between py-1">
                                            <span>{product?.name || 'Unknown Product'} x {item.quantity}</span>
                                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                         <div className="border-t pt-2 mt-4 space-y-1 text-right">
                            <p><strong>Subtotal:</strong> ₹{selectedOrder.subTotal.toFixed(2)}</p>
                            <p><strong>Tax:</strong> ₹{selectedOrder.tax.toFixed(2)}</p>
                            <p className="text-xl font-bold"><strong>Total:</strong> ₹{selectedOrder.total.toFixed(2)}</p>
                            <p><strong>Payment Mode:</strong> {selectedOrder.paymentMode}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Bills;