import React, { useState, useContext } from 'react';
import { ERPContext } from '../App';
import Modal from './common/Modal';
import { Product, ProductFormData } from '../types';

const Inventory: React.FC = () => {
    const context = useContext(ERPContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '', category: '', price: 0, stock: 0, lowStockThreshold: 10, supplierId: ''
    });

    if (!context) return <div>Loading...</div>;
    const { data, actions } = context;

    const openModalForNew = () => {
        setEditingProduct(null);
        setFormData({ name: '', category: '', price: 0, stock: 0, lowStockThreshold: 10, supplierId: data.suppliers[0]?.id || '' });
        setIsModalOpen(true);
    };

    const openModalForEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' || name === 'lowStockThreshold' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            actions.updateProduct({ ...editingProduct, ...formData });
        } else {
            actions.addProduct(formData);
        }
        handleCloseModal();
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Inventory Management</h1>
                <button onClick={openModalForNew} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition self-start md:self-auto">
                    <i className="fas fa-plus mr-2"></i>Add New Product
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Product Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Stock</th>
                            <th className="p-4 font-semibold">Supplier</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 whitespace-nowrap">{product.name}</td>
                                <td className="p-4 whitespace-nowrap">{product.category}</td>
                                <td className="p-4 whitespace-nowrap">₹{product.price.toFixed(2)}</td>
                                <td className={`p-4 font-bold whitespace-nowrap ${product.stock <= product.lowStockThreshold ? 'text-red-500' : 'text-green-600'}`}>
                                    {product.stock}
                                </td>
                                <td className="p-4 whitespace-nowrap">{data.suppliers.find(s => s.id === product.supplierId)?.name || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => openModalForEdit(product)} className="text-blue-500 hover:text-blue-700 mr-4"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => actions.deleteProduct(product.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded bg-white" required />
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded bg-white" required />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded bg-white" step="0.01" min="0" required />
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock Quantity" className="w-full p-2 border rounded bg-white" min="0" required />
                    <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} placeholder="Low Stock Threshold" className="w-full p-2 border rounded bg-white" min="0" required />
                    <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="w-full p-2 border rounded bg-white" required>
                        <option value="" disabled>Select Supplier</option>
                        {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editingProduct ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;