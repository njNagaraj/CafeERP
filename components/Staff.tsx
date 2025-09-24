import React, { useState, useContext } from 'react';
import { ERPContext } from '../App';
import Modal from './common/Modal';
import { Staff, StaffFormData, StaffRole, AttendanceStatus } from '../types';

const StaffManagement: React.FC = () => {
    const context = useContext(ERPContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [formData, setFormData] = useState<StaffFormData>({
        name: '', role: StaffRole.WAITER, shift: 'Morning', salary: 0, joinDate: new Date()
    });
    const [attendanceDate, setAttendanceDate] = useState(new Date());

    if (!context) return <div>Loading...</div>;
    const { data, actions } = context;

    const openModalForNew = () => {
        setEditingStaff(null);
        setFormData({ name: '', role: StaffRole.WAITER, shift: 'Morning', salary: 0, joinDate: new Date() });
        setIsModalOpen(true);
    };

    const openModalForEdit = (staff: Staff) => {
        setEditingStaff(staff);
        setFormData(staff);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'joinDate') {
            setFormData(prev => ({...prev, [name]: new Date(value)}));
        } else {
             setFormData(prev => ({ ...prev, [name]: name === 'salary' ? parseFloat(value) : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStaff) {
            actions.updateStaff({ ...editingStaff, ...formData });
        } else {
            actions.addStaff(formData);
        }
        handleCloseModal();
    };

    const calculateSalary = (staffMember: Staff) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const perDaySalary = staffMember.salary / daysInMonth;

        const presentDays = data.attendance.filter(a => 
            a.staffId === staffMember.id &&
            a.status === AttendanceStatus.PRESENT &&
            new Date(a.date).getMonth() === currentMonth &&
            new Date(a.date).getFullYear() === currentYear
        ).length;

        return perDaySalary * presentDays;
    };


    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Staff Management</h1>
                <button onClick={openModalForNew} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition self-start md:self-auto">
                    <i className="fas fa-user-plus mr-2"></i>Add New Staff
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-10">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">Base Salary</th>
                            <th className="p-4 font-semibold">Calculated Salary (This Month)</th>
                            <th className="p-4 font-semibold">Join Date</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.staff.map(staffMember => (
                            <tr key={staffMember.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 whitespace-nowrap">{staffMember.name}</td>
                                <td className="p-4 whitespace-nowrap">{staffMember.role}</td>
                                <td className="p-4 whitespace-nowrap">₹{staffMember.salary.toFixed(2)}</td>
                                <td className="p-4 whitespace-nowrap font-bold text-green-700">₹{calculateSalary(staffMember).toFixed(2)}</td>
                                <td className="p-4 whitespace-nowrap">{staffMember.joinDate.toLocaleDateString()}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => openModalForEdit(staffMember)} className="text-blue-500 hover:text-blue-700 mr-4"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => actions.deleteStaff(staffMember.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* Attendance Section */}
            <div className="mt-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                     <h2 className="text-2xl font-bold text-gray-800">Daily Attendance</h2>
                     <input 
                        type="date" 
                        value={attendanceDate.toISOString().split('T')[0]} 
                        onChange={(e) => setAttendanceDate(new Date(e.target.value))}
                        className="p-2 border rounded-lg bg-white shadow-sm"
                     />
                </div>
                 <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Staff Name</th>
                                <th className="p-4 font-semibold">Status for {attendanceDate.toLocaleDateString()}</th>
                                <th className="p-4 font-semibold">Mark Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.staff.map(staffMember => {
                                const attendanceRecord = data.attendance.find(a => a.staffId === staffMember.id && new Date(a.date).toDateString() === attendanceDate.toDateString());
                                const status = attendanceRecord ? attendanceRecord.status : 'Not Marked';

                                return (
                                <tr key={staffMember.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 whitespace-nowrap">{staffMember.name}</td>
                                    <td className="p-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-800' :
                                            status === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-800' :
                                            status === AttendanceStatus.LEAVE ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap space-x-2">
                                        <button onClick={() => actions.markAttendance(staffMember.id, attendanceDate, AttendanceStatus.PRESENT)} className={`px-3 py-1 rounded transition ${status === AttendanceStatus.PRESENT ? 'bg-green-500 text-white shadow' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}>Present</button>
                                        <button onClick={() => actions.markAttendance(staffMember.id, attendanceDate, AttendanceStatus.ABSENT)} className={`px-3 py-1 rounded transition ${status === AttendanceStatus.ABSENT ? 'bg-red-500 text-white shadow' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>Absent</button>
                                        <button onClick={() => actions.markAttendance(staffMember.id, attendanceDate, AttendanceStatus.LEAVE)} className={`px-3 py-1 rounded transition ${status === AttendanceStatus.LEAVE ? 'bg-yellow-500 text-white shadow' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>Leave</button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStaff ? 'Edit Staff' : 'Add New Staff'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded bg-white" required />
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                     <select name="shift" value={formData.shift} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                        <option>Morning</option>
                        <option>Evening</option>
                    </select>
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" className="w-full p-2 border rounded bg-white" min="0" required />
                    <input type="date" name="joinDate" value={formData.joinDate.toISOString().split('T')[0]} onChange={handleChange} className="w-full p-2 border rounded bg-white" required />

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editingStaff ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StaffManagement;