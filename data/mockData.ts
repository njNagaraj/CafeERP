import { Product, Supplier, Order, Staff, Expense, StaffRole, PaymentMode, Attendance, AttendanceStatus } from '../types';

export const mockSuppliers: Supplier[] = [
  { id: 'sup1', name: 'Fresh Teas Co.', contact: 'contact@freshteas.com' },
  { id: 'sup2', name: 'Bakery Delights', contact: 'sales@bakerydelights.com' },
  { id: 'sup3', name: 'Dairy Farms Inc.', contact: 'orders@dairyfarms.com' },
];

export const mockProducts: Product[] = [
  { id: 'prod1', name: 'Masala Chai', category: 'Hot Teas', price: 20, stock: 100, lowStockThreshold: 20, supplierId: 'sup1' },
  { id: 'prod2', name: 'Green Tea', category: 'Hot Teas', price: 25, stock: 18, lowStockThreshold: 20, supplierId: 'sup1' },
  { id: 'prod3', name: 'Iced Lemon Tea', category: 'Iced Teas', price: 40, stock: 60, lowStockThreshold: 15, supplierId: 'sup1' },
  { id: 'prod4', name: 'Peach Iced Tea', category: 'Iced Teas', price: 50, stock: 12, lowStockThreshold: 15, supplierId: 'sup1' },
  { id: 'prod5', name: 'Samosa', category: 'Snacks', price: 15, stock: 120, lowStockThreshold: 30, supplierId: 'sup2' },
  { id: 'prod6', name: 'Croissant', category: 'Snacks', price: 60, stock: 10, lowStockThreshold: 10, supplierId: 'sup2' },
  { id: 'prod7', name: 'Milk Unit', category: 'Ingredients', price: 10, stock: 200, lowStockThreshold: 50, supplierId: 'sup3' },
  { id: 'prod8', name: 'Sugar Unit', category: 'Ingredients', price: 5, stock: 500, lowStockThreshold: 100, supplierId: 'sup3' },
];

export const mockStaff: Staff[] = [
  { id: 'staff1', name: 'Alice Johnson', role: StaffRole.MANAGER, shift: 'Morning', salary: 30000, joinDate: new Date('2023-01-15') },
  { id: 'staff2', name: 'Bob Williams', role: StaffRole.CASHIER, shift: 'Morning', salary: 18000, joinDate: new Date('2023-03-01') },
  { id: 'staff3', name: 'Charlie Brown', role: StaffRole.CHEF, shift: 'Morning', salary: 22000, joinDate: new Date('2023-02-20') },
  { id: 'staff4', name: 'Diana Miller', role: StaffRole.CASHIER, shift: 'Evening', salary: 18000, joinDate: new Date('2023-05-10') },
];

export const mockOrders: Order[] = [
  {
    id: 'ord1',
    items: [{ productId: 'prod1', quantity: 2, price: 20 }, { productId: 'prod5', quantity: 1, price: 15 }],
    subTotal: 55,
    tax: 4.4,
    discount: 0,
    total: 59.4,
    paymentMode: PaymentMode.CARD,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: 'ord2',
    items: [{ productId: 'prod3', quantity: 1, price: 40 }],
    subTotal: 40,
    tax: 3.2,
    discount: 0,
    total: 43.2,
    paymentMode: PaymentMode.UPI,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
   {
    id: 'ord3',
    items: [{ productId: 'prod2', quantity: 1, price: 25 }, { productId: 'prod6', quantity: 1, price: 60 }],
    subTotal: 85,
    tax: 6.8,
    discount: 0,
    total: 91.8,
    paymentMode: PaymentMode.CASH,
    createdAt: new Date(),
  }
];

export const mockExpenses: Expense[] = [
  { id: 'exp1', description: 'Monthly Rent', amount: 20000, category: 'Rent', date: new Date(new Date().setDate(1)) },
  { id: 'exp2', description: 'Tea & Snacks Purchase', amount: 8000, category: 'Supplies', date: new Date(new Date().setDate(new Date().getDate() - 5)) },
  { id: 'exp3', description: 'Electricity Bill', amount: 4500, category: 'Utilities', date: new Date(new Date().setDate(new Date().getDate() - 3)) },
];

export const mockAttendance: Attendance[] = [
  // Mock some data for Alice for the current month
  { id: 'att1', staffId: 'staff1', date: new Date(new Date().setDate(1)), status: AttendanceStatus.PRESENT },
  { id: 'att2', staffId: 'staff1', date: new Date(new Date().setDate(2)), status: AttendanceStatus.PRESENT },
  { id: 'att3', staffId: 'staff1', date: new Date(new Date().setDate(3)), status: AttendanceStatus.LEAVE },
  { id: 'att4', staffId: 'staff1', date: new Date(new Date().setDate(4)), status: AttendanceStatus.PRESENT },

  // Mock some data for Bob
  { id: 'att5', staffId: 'staff2', date: new Date(new Date().setDate(1)), status: AttendanceStatus.PRESENT },
  { id: 'att6', staffId: 'staff2', date: new Date(new Date().setDate(2)), status: AttendanceStatus.ABSENT },
  { id: 'att7', staffId: 'staff2', date: new Date(new Date().setDate(3)), status: AttendanceStatus.PRESENT },
  { id: 'att8', staffId: 'staff2', date: new Date(new Date().setDate(4)), status: AttendanceStatus.PRESENT },
];