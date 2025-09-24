// Create the main App component, context, state management, and navigation.
import React, { useState, createContext } from 'react';
import {
  Product,
  Order,
  Staff,
  Expense,
  ERPData,
  ERPActions,
  ERPContextType,
  ProductFormData,
  OrderFormData,
  StaffFormData,
  ExpenseFormData,
  Attendance,
  AttendanceStatus,
} from './types';
import { mockProducts, mockSuppliers, mockOrders, mockStaff, mockExpenses, mockAttendance } from './data/mockData';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Financials from './components/Financials';
import StaffManagement from './components/Staff';
import Bills from './components/Bills';

// Context
export const ERPContext = createContext<ERPContextType | null>(null);

const App: React.FC = () => {
  const [data, setData] = useState<ERPData>({
    products: mockProducts,
    suppliers: mockSuppliers,
    orders: mockOrders,
    staff: mockStaff,
    expenses: mockExpenses,
    attendance: mockAttendance,
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  }

  const actions: ERPActions = {
    // Product Actions
    addProduct: (productData) => {
      const newProduct: Product = { id: `prod${Date.now()}`, ...productData };
      setData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    },
    updateProduct: (updatedProduct) => {
      setData(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p),
      }));
    },
    deleteProduct: (productId) => {
      setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== productId) }));
    },

    // Order Actions
    createOrder: (orderData) => {
        const newOrder: Order = {
            id: `ord${Date.now()}`,
            createdAt: new Date(),
            ...orderData,
        };
        setData(prev => {
            const newProducts = prev.products.map(p => {
                const itemInOrder = orderData.items.find(item => item.productId === p.id);
                if (itemInOrder) {
                    return { ...p, stock: p.stock - itemInOrder.quantity };
                }
                return p;
            });
            return { 
                ...prev, 
                orders: [...prev.orders, newOrder], 
                products: newProducts 
            };
        });
    },

    // Staff Actions
    addStaff: (staffData) => {
        const newStaff: Staff = { id: `staff${Date.now()}`, ...staffData };
        setData(prev => ({ ...prev, staff: [...prev.staff, newStaff] }));
    },
    updateStaff: (updatedStaff) => {
        setData(prev => ({
            ...prev,
            staff: prev.staff.map(s => s.id === updatedStaff.id ? updatedStaff : s),
        }));
    },
    deleteStaff: (staffId) => {
        setData(prev => ({ ...prev, staff: prev.staff.filter(s => s.id !== staffId) }));
    },
    
    // Expense Actions
    addExpense: (expenseData) => {
        const newExpense: Expense = { id: `exp${Date.now()}`, ...expenseData };
        setData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    },

    // Attendance Actions
    markAttendance: (staffId, date, status) => {
        setData(prev => {
            const dateString = date.toDateString();
            const existingIndex = prev.attendance.findIndex(a => a.staffId === staffId && a.date.toDateString() === dateString);
            
            let newAttendance = [...prev.attendance];

            if (existingIndex > -1) {
                // Update existing record
                newAttendance[existingIndex] = { ...newAttendance[existingIndex], status };
            } else {
                // Add new record
                const newRecord: Attendance = {
                    id: `att${Date.now()}`,
                    staffId,
                    date,
                    status
                };
                newAttendance.push(newRecord);
            }

            return { ...prev, attendance: newAttendance };
        });
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'pos': return <POS />;
      case 'inventory': return <Inventory />;
      case 'financials': return <Financials />;
      case 'staff': return <StaffManagement />;
      case 'bills': return <Bills />;
      default: return <Dashboard />;
    }
  };
  
  const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
      { id: 'pos', label: 'POS', icon: 'fa-cash-register' },
      { id: 'inventory', label: 'Inventory', icon: 'fa-boxes' },
      { id: 'bills', label: 'Bills', icon: 'fa-file-invoice-dollar' },
      { id: 'financials', label: 'Financials', icon: 'fa-chart-line' },
      { id: 'staff', label: 'Staff', icon: 'fa-users-cog' },
  ];

  return (
    <ERPContext.Provider value={{ data, actions }}>
      <div className="relative min-h-screen md:flex bg-gray-100 font-sans">
        {/* Mobile overlay */}
        {isSidebarOpen && (
            <div 
            className="md:hidden fixed inset-0 bg-black opacity-50 z-20"
            onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}

        {/* Sidebar */}
        <aside className={`w-64 bg-gray-800 text-white flex flex-col fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
            <div className="h-20 flex items-center justify-center bg-gray-900">
                <i className="fas fa-mug-hot text-3xl text-blue-400"></i>
                <h1 className="text-2xl font-bold ml-3">CafeMilan</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleViewChange(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-lg rounded-lg transition-colors duration-200 ${
                            activeView === item.id 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <i className={`fas ${item.icon} w-8 text-center`}></i>
                        <span className="ml-4">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
             <header className="h-20 bg-white shadow-md flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center">
                    <button className="md:hidden text-gray-600 mr-4" onClick={() => setIsSidebarOpen(true)}>
                        <i className="fas fa-bars fa-lg"></i>
                    </button>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 capitalize">{activeView}</h2>
                </div>
                <div>
                     {/* Can add user profile or other header items here */}
                </div>
            </header>
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                 {renderView()}
            </div>
        </main>
      </div>
    </ERPContext.Provider>
  );
};

export default App;