import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, Medicine, Appointment } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calendar, 
  Clock, 
  Pill, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle,
  Shield,
  Package,
  Users
} from 'lucide-react';
import logo from 'figma:asset/535fbbef6e8afe0ed959cbadbcaf6275e9f332d7.png';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    appointments, 
    medicines, 
    addMedicine, 
    updateMedicine, 
    deleteMedicine, 
    updateAppointment, 
    deleteAppointment,
    setUserRole 
  } = useApp();

  // Dialog states
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  const [isEditMedicineDialogOpen, setIsEditMedicineDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Medicine form state
  const [medName, setMedName] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medUnit, setMedUnit] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medDescription, setMedDescription] = useState('');

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medName,
      stock: parseInt(medStock),
      unit: medUnit,
      category: medCategory,
      description: medDescription,
    };

    addMedicine(newMedicine);
    setIsMedicineDialogOpen(false);
    
    // Reset form
    setMedName('');
    setMedStock('');
    setMedUnit('');
    setMedCategory('');
    setMedDescription('');
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedName(medicine.name);
    setMedStock(medicine.stock.toString());
    setMedUnit(medicine.unit);
    setMedCategory(medicine.category);
    setMedDescription(medicine.description);
    setIsEditMedicineDialogOpen(true);
  };

  const handleUpdateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, {
        name: medName,
        stock: parseInt(medStock),
        unit: medUnit,
        category: medCategory,
        description: medDescription,
      });
      setIsEditMedicineDialogOpen(false);
      setEditingMedicine(null);
      
      // Reset form
      setMedName('');
      setMedStock('');
      setMedUnit('');
      setMedCategory('');
      setMedDescription('');
    }
  };

  const handleDeleteMedicine = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      deleteMedicine(id);
    }
  };

  const handleUpdateAppointmentStatus = (id: string, status: 'approved' | 'rejected') => {
    updateAppointment(id, { status });
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock > 100) return 'text-green-600';
    if (stock > 50) return 'text-amber-600';
    return 'text-red-600';
  };

  // Statistics
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const approvedCount = appointments.filter(a => a.status === 'approved').length;
  const lowStockCount = medicines.filter(m => m.stock < 50).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="CIT-U Logo" className="w-10 h-10 object-contain" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#800000]">CIT-U Medical</span>
                  <span className="text-sm text-gray-500">|</span>
                  <span className="text-sm text-gray-600">Admin Dashboard</span>
                </div>
                <p className="text-sm text-gray-500">Clinic Management System</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Appointments</p>
                <p className="text-4xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="bg-amber-100 p-4 rounded-full">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved Today</p>
                <p className="text-4xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-4xl font-bold text-red-600">{lowStockCount}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <Package className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="appointments" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-12 bg-white border shadow-sm">
            <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <Users className="w-5 h-5" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="medicines" className="flex items-center gap-2 data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <Pill className="w-5 h-5" />
              Medicine Inventory
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#800000]">All Appointments</h2>
                  <p className="text-gray-600 mt-1">Manage student appointment requests</p>
                </div>
              </div>
              
              {appointments.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-gray-300 rounded-lg">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments</h3>
                  <p className="text-gray-600">No student appointments have been submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#B8860B] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={`flex items-center gap-1 ${getStatusColor(appointment.status)} text-sm px-3 py-1`}>
                              {getStatusIcon(appointment.status)}
                              {appointment.status.toUpperCase()}
                            </Badge>
                            <span className="text-base font-semibold text-[#800000]">
                              {appointment.studentName}
                            </span>
                            <span className="text-sm text-gray-500">({appointment.studentId})</span>
                            <span className="text-sm text-gray-500">{appointment.email}</span>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-[#800000] mb-2">Reason for Visit</h4>
                            <p className="text-gray-700">{appointment.reason}</p>
                          </div>

                          <div className="flex items-center gap-8 text-base">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-5 h-5 text-[#800000]" />
                              {new Date(appointment.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-5 h-5 text-[#800000]" />
                              {appointment.time}
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 pt-2 border-t">
                            Submitted: {new Date(appointment.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white h-10 px-4"
                                onClick={() => handleUpdateAppointmentStatus(appointment.id, 'approved')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-10 px-4"
                                onClick={() => handleUpdateAppointmentStatus(appointment.id, 'rejected')}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white h-10 px-4"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Medicines Tab */}
          <TabsContent value="medicines" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#800000]">Medicine Inventory</h2>
                  <p className="text-gray-600 mt-1">Manage clinic medicine stock levels</p>
                </div>
                <Dialog open={isMedicineDialogOpen} onOpenChange={setIsMedicineDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#B8860B] hover:bg-[#DAA520] text-white flex items-center gap-2 h-11">
                      <Plus className="w-5 h-5" />
                      Add Medicine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleAddMedicine}>
                      <DialogHeader>
                        <DialogTitle className="text-[#800000] text-xl">Add New Medicine</DialogTitle>
                        <DialogDescription className="text-base">
                          Add a new medicine to the clinic inventory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="medName" className="text-base">Medicine Name</Label>
                          <Input
                            id="medName"
                            placeholder="e.g., Paracetamol"
                            value={medName}
                            onChange={(e) => setMedName(e.target.value)}
                            required
                            className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="medStock" className="text-base">Stock Quantity</Label>
                            <Input
                              id="medStock"
                              type="number"
                              placeholder="e.g., 100"
                              value={medStock}
                              onChange={(e) => setMedStock(e.target.value)}
                              required
                              min="0"
                              className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="medUnit" className="text-base">Unit</Label>
                            <Input
                              id="medUnit"
                              placeholder="e.g., tablets"
                              value={medUnit}
                              onChange={(e) => setMedUnit(e.target.value)}
                              required
                              className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medCategory" className="text-base">Category</Label>
                          <Input
                            id="medCategory"
                            placeholder="e.g., Pain Relief"
                            value={medCategory}
                            onChange={(e) => setMedCategory(e.target.value)}
                            required
                            className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medDescription" className="text-base">Description</Label>
                          <Textarea
                            id="medDescription"
                            placeholder="Brief description of the medicine"
                            value={medDescription}
                            onChange={(e) => setMedDescription(e.target.value)}
                            required
                            rows={3}
                            className="border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-[#800000] hover:bg-[#600000] text-white h-11">
                          Add Medicine
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-[#B8860B] transition-colors hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#800000] mb-2">{medicine.name}</h3>
                        <Badge className="bg-[#B8860B] text-white border-0 text-xs">
                          {medicine.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t mb-4">
                      <span className="text-sm font-medium text-gray-700">Stock:</span>
                      <span className={`text-lg font-bold ${getStockColor(medicine.stock)}`}>
                        {medicine.stock} {medicine.unit}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white h-9"
                        onClick={() => handleEditMedicine(medicine)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-9"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Medicine Dialog */}
      <Dialog open={isEditMedicineDialogOpen} onOpenChange={setIsEditMedicineDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateMedicine}>
            <DialogHeader>
              <DialogTitle className="text-[#800000] text-xl">Edit Medicine</DialogTitle>
              <DialogDescription className="text-base">
                Update medicine information and stock levels
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editMedName" className="text-base">Medicine Name</Label>
                <Input
                  id="editMedName"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  required
                  className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editMedStock" className="text-base">Stock Quantity</Label>
                  <Input
                    id="editMedStock"
                    type="number"
                    value={medStock}
                    onChange={(e) => setMedStock(e.target.value)}
                    required
                    min="0"
                    className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editMedUnit" className="text-base">Unit</Label>
                  <Input
                    id="editMedUnit"
                    value={medUnit}
                    onChange={(e) => setMedUnit(e.target.value)}
                    required
                    className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMedCategory" className="text-base">Category</Label>
                <Input
                  id="editMedCategory"
                  value={medCategory}
                  onChange={(e) => setMedCategory(e.target.value)}
                  required
                  className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMedDescription" className="text-base">Description</Label>
                <Textarea
                  id="editMedDescription"
                  value={medDescription}
                  onChange={(e) => setMedDescription(e.target.value)}
                  required
                  rows={3}
                  className="border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#800000] hover:bg-[#600000] text-white h-11">
                Update Medicine
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}