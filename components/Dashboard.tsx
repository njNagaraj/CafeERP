import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ERPContext } from '../App';
import Card from './common/Card';

const Dashboard: React.FC = () => {
    const context = useContext(ERPContext);
    if (!context) return <div>Loading...</div>;

    const { orders, products, staff } = context.data;

    const todaySales = useMemo(() => orders
        .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, order) => sum + order.total, 0), [orders]);

    const lowStockProducts = useMemo(() => products.filter(p => p.stock <= p.lowStockThreshold), [products]);

    const salesData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            sales: orders
                .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
                .reduce((sum, order) => sum + order.total, 0),
        };
    }).reverse(), [orders]);

    const monthlyBestSeller = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const salesByProduct: { [productId: string]: number } = {};

        orders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            })
            .forEach(order => {
                order.items.forEach(item => {
                    salesByProduct[item.productId] = (salesByProduct[item.productId] || 0) + item.quantity;
                });
            });

        const bestSellerId = Object.keys(salesByProduct).reduce((a, b) => salesByProduct[a] > salesByProduct[b] ? a : b, '');
        
        if (!bestSellerId) return null;

        const product = products.find(p => p.id === bestSellerId);
        return {
            name: product?.name || 'Unknown',
            quantity: salesByProduct[bestSellerId]
        };
    }, [orders, products]);


    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Today's Sales" value={`₹${todaySales.toFixed(2)}`} icon="fa-rupee-sign" color="text-green-500" />
                <Card title="Low Stock Items" value={lowStockProducts.length} icon="fa-exclamation-triangle" color="text-yellow-500" />
                <Card title="Total Staff" value={staff.length} icon="fa-users" color="text-blue-500" />
                <Card title="Total Orders Today" value={orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length} icon="fa-receipt" color="text-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Weekly Sales Overview</h2>
                    <div className="w-full h-80 md:h-96">
                        <ResponsiveContainer>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="sales" fill="#4ade80" name="Sales (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Side: Insights */}
                <div className="space-y-8">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                           <i className="fas fa-trophy text-yellow-400 mr-3"></i> Monthly Best Seller
                        </h3>
                        {monthlyBestSeller ? (
                            <div>
                                <p className="text-3xl font-bold text-gray-800">{monthlyBestSeller.name}</p>
                                <p className="text-gray-500">{monthlyBestSeller.quantity} units sold this month.</p>
                                <p className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                    <i className="fas fa-lightbulb mr-2"></i>Suggestion: This product is a hit! Consider promoting it or ensuring it's always in stock.
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No sales data for this month yet.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Low Stock Alerts</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map(product => (
                                <div key={product.id} className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-red-800">{product.name}</p>
                                        <p className="text-sm text-red-600">
                                            Stock: <span className="font-bold">{product.stock}</span> (Threshold: {product.lowStockThreshold})
                                        </p>
                                    </div>
                                    <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
                                </div>
                                ))
                            ) : (
                                 <div className="text-center py-4">
                                    <i className="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
                                    <p className="text-gray-600">Great! All products are well-stocked.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;