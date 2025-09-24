// Create all the necessary types for the application.

export enum StaffRole {
  MANAGER = 'Manager',
  CASHIER = 'Cashier',
  CHEF = 'Chef',
  WAITER = 'Waiter',
}

export enum PaymentMode {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI',
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LEAVE = 'Leave',
}

export interface Attendance {
  id: string;
  staffId: string;
  date: Date;
  status: AttendanceStatus;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  supplierId: string;
}

export type ProductFormData = Omit<Product, 'id'>;

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMode: PaymentMode;
  createdAt: Date;
}

export type OrderFormData = Omit<Order, 'id' | 'createdAt'>;

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  shift: string;
  salary: number;
  joinDate: Date;
}

export type StaffFormData = Omit<Staff, 'id'>;

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export type ExpenseFormData = Omit<Expense, 'id'>;

export interface ERPData {
  products: Product[];
  suppliers: Supplier[];
  orders: Order[];
  staff: Staff[];
  expenses: Expense[];
  attendance: Attendance[];
}

export interface ERPActions {
  // Products
  addProduct: (productData: ProductFormData) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Orders
  createOrder: (orderData: OrderFormData) => void;
  // Staff
  addStaff: (staffData: StaffFormData) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (staffId: string) => void;
  // Expenses
  addExpense: (expenseData: ExpenseFormData) => void;
  // Attendance
  markAttendance: (staffId: string, date: Date, status: AttendanceStatus) => void;
}

export interface ERPContextType {
  data: ERPData;
  actions: ERPActions;
}