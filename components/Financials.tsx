import React, { useContext, useMemo, useState } from 'react';
import { ERPContext } from '../App';
import Modal from './common/Modal';
import { ExpenseFormData } from '../types';

const Financials: React.FC = () => {
    const context = useContext(ERPContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<ExpenseFormData>({
        description: '', amount: 0, category: 'Other', date: new Date()
    });

    if (!context) return <div>Loading...</div>;

    const { data, actions } = context;

    const totalRevenue = useMemo(() => data.orders.reduce((sum, order) => sum + order.total, 0), [data.orders]);
    const totalExpenses = useMemo(() => data.expenses.reduce((sum, expense) => sum + expense.amount, 0), [data.expenses]);
    const profit = totalRevenue - totalExpenses;

    const handleOpenModal = () => {
        setFormData({ description: '', amount: 0, category: 'Other', date: new Date() });
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'date') {
            setFormData(prev => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        actions.addExpense(formData);
        handleCloseModal();
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Financials</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Total Revenue</h3>
                    <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-red-100 text-red-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Total Expenses</h3>
                    <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div className={`p-6 rounded-lg shadow ${profit >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <h3 className="font-semibold text-lg">Profit / Loss</h3>
                    <p className="text-3xl font-bold">₹{profit.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sales Report</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold">Order ID</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...data.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(order => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 whitespace-nowrap">{order.id}</td>
                                        <td className="p-4 whitespace-nowrap">{order.createdAt.toLocaleDateString()}</td>
                                        <td className="p-4 whitespace-nowrap">₹{order.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                        <h2 className="text-2xl font-semibold text-gray-700">Expense Tracking</h2>
                        <button onClick={handleOpenModal} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition self-start md:self-auto">
                            <i className="fas fa-plus mr-2"></i>Add Expense
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold">Description</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...data.expenses].sort((a, b) => b.date.getTime() - a.date.getTime()).map(expense => (
                                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 whitespace-nowrap">{expense.description}</td>
                                        <td className="p-4 whitespace-nowrap">{expense.category}</td>
                                        <td className="p-4 whitespace-nowrap">{expense.date.toLocaleDateString()}</td>
                                        <td className="p-4 whitespace-nowrap">₹{expense.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Expense">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded bg-white" required />
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full p-2 border rounded bg-white" step="0.01" min="0" required />
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option>Supplies</option>
                        <option>Rent</option>
                        <option>Salaries</option>
                        <option>Utilities</option>
                        <option>Other</option>
                    </select>
                     <input type="date" name="date" value={formData.date.toISOString().split('T')[0]} onChange={handleChange} className="w-full p-2 border rounded bg-white" required />
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Add Expense</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Financials;