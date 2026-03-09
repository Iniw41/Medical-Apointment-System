import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Calendar, 
  Clock, 
  Pill, 
  LogOut, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Loader,
  Package
} from 'lucide-react';
import logo from 'figma:asset/535fbbef6e8afe0ed959cbadbcaf6275e9f332d7.png';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser, appointments, medicines, addAppointment, setUserRole } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppointment = {
      id: Date.now().toString(),
      studentId: 'STU' + Date.now().toString().slice(-3),
      studentName: currentUser,
      email,
      reason,
      date,
      time,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    addAppointment(newAppointment);
    setIsDialogOpen(false);
    
    // Reset form
    setReason('');
    setDate('');
    setTime('');
    setEmail('');
  };

  // Filter appointments for current user
  const myAppointments = appointments.filter(apt => apt.studentName === currentUser);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Loader className="w-4 h-4" />;
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
                  <span className="text-sm text-gray-600">Student Portal</span>
                </div>
                <p className="text-sm text-gray-500">Welcome, {currentUser}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="medicines" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-12 bg-white border shadow-sm">
            <TabsTrigger value="medicines" className="flex items-center gap-2 data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <Package className="w-5 h-5" />
              Medicine Inventory
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <Calendar className="w-5 h-5" />
              My Appointments
            </TabsTrigger>
          </TabsList>

          {/* Medicine Inventory Tab */}
          <TabsContent value="medicines" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#800000]">Available Medicines</h2>
                  <p className="text-gray-600 mt-1">Current stock of medicines at CIT-U Medical Clinic</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-[#800000] transition-colors hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[#800000]">{medicine.name}</h3>
                      <Badge className="bg-[#B8860B] text-white border-0 text-xs">
                        {medicine.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm font-medium text-gray-700">Available Stock:</span>
                      <span className={`text-lg font-bold ${getStockColor(medicine.stock)}`}>
                        {medicine.stock} {medicine.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#800000]">My Appointments</h2>
                  <p className="text-gray-600 mt-1">Manage your medical checkup appointments</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#800000] hover:bg-[#600000] text-white flex items-center gap-2 h-11">
                      <Plus className="w-5 h-5" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleBookAppointment}>
                      <DialogHeader>
                        <DialogTitle className="text-[#800000] text-xl">Book Medical Appointment</DialogTitle>
                        <DialogDescription className="text-base">
                          Fill in the details below to schedule your checkup
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@cit.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason" className="text-base">Reason for Visit</Label>
                          <Textarea
                            id="reason"
                            placeholder="Describe your symptoms or reason for checkup"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows={3}
                            className="border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date" className="text-base">Preferred Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              required
                              min={new Date().toISOString().split('T')[0]}
                              className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time" className="text-base">Preferred Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              required
                              className="h-11 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-[#800000] hover:bg-[#600000] text-white h-11">
                          Submit Appointment
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {myAppointments.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-gray-300 rounded-lg">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
                  <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-[#800000] hover:bg-[#600000] text-white h-11"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#800000] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <Badge className={`flex items-center gap-1 ${getStatusColor(appointment.status)} text-sm px-3 py-1`}>
                              {getStatusIcon(appointment.status)}
                              {appointment.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500 font-medium">ID: {appointment.studentId}</span>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-[#800000] mb-2">Appointment Details</h4>
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}