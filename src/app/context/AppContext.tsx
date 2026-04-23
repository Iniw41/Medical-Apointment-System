import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-81b5d14c`;

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  unit: string;
  category: string;
  description: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AppContextType {
  userRole: 'student' | 'admin' | null;
  setUserRole: (role: 'student' | 'admin' | null) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  medicines: Medicine[];
  setMedicines: (medicines: Medicine[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addMedicine: (medicine: Medicine) => Promise<void>;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  loadMedicines: () => Promise<void>;
  loadAppointments: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    stock: 150,
    unit: 'tablets',
    category: 'Pain Relief',
    description: 'For fever and mild to moderate pain'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    stock: 100,
    unit: 'tablets',
    category: 'Pain Relief',
    description: 'Anti-inflammatory medication'
  },
  {
    id: '3',
    name: 'Amoxicillin',
    stock: 80,
    unit: 'capsules',
    category: 'Antibiotic',
    description: 'For bacterial infections'
  },
  {
    id: '4',
    name: 'Cetirizine',
    stock: 120,
    unit: 'tablets',
    category: 'Antihistamine',
    description: 'For allergies and hay fever'
  },
  {
    id: '5',
    name: 'Vitamin C',
    stock: 200,
    unit: 'tablets',
    category: 'Supplement',
    description: 'Immune system support'
  },
  {
    id: '6',
    name: 'Hydrocortisone Cream',
    stock: 45,
    unit: 'tubes',
    category: 'Topical',
    description: 'For skin irritation and rashes'
  },
  {
    id: '7',
    name: 'Loperamide',
    stock: 60,
    unit: 'tablets',
    category: 'Digestive',
    description: 'For diarrhea'
  },
  {
    id: '8',
    name: 'Omeprazole',
    stock: 70,
    unit: 'capsules',
    category: 'Digestive',
    description: 'For acid reflux and heartburn'
  },
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Juan Dela Cruz',
    email: 'juan.delacruz@cit.edu',
    reason: 'Annual checkup',
    date: '2026-03-10',
    time: '09:00',
    status: 'approved',
    createdAt: '2026-03-05T10:00:00Z'
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Maria Santos',
    email: 'maria.santos@cit.edu',
    reason: 'Flu symptoms',
    date: '2026-03-08',
    time: '10:30',
    status: 'pending',
    createdAt: '2026-03-06T14:30:00Z'
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [currentStudentId, setCurrentStudentId] = useState<string>('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load medicines from server
  const loadMedicines = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/medicines`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.status === 404) {
        console.warn('Medicines endpoint not available, using local data');
        setMedicines(initialMedicines);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        // Transform database format to app format
        const transformedMedicines = data.map((med: any) => ({
          id: med.id,
          name: med.medicine_name,
          stock: med.amount,
          unit: med.unit,
          category: 'General', // Default category
          description: med.description
        }));
        setMedicines(transformedMedicines);
      } else {
        console.error('Failed to load medicines:', await response.text());
        setMedicines(initialMedicines);
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
      setMedicines(initialMedicines);
    }
  };

  // Load appointments from server
  const loadAppointments = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.status === 404) {
        console.warn('Appointments endpoint not available, using local data');
        setAppointments(initialAppointments);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        // Transform database format to app format
        const transformedAppointments = data.map((apt: any) => ({
          id: apt.id,
          studentId: apt.student_id,
          studentName: apt.student_name,
          email: '', // Not stored in database
          reason: apt.reason,
          date: apt.appointment_date,
          time: apt.appointment_time,
          status: apt.status,
          createdAt: apt.created_at
        }));
        setAppointments(transformedAppointments);
      } else {
        console.error('Failed to load appointments:', await response.text());
        setAppointments(initialAppointments);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments(initialAppointments);
    }
  };

  // Load data when user role changes
  useEffect(() => {
    if (userRole) {
      loadMedicines();
      loadAppointments();
    }
  }, [userRole]);

  const addMedicine = async (medicine: Medicine) => {
    try {
      const response = await fetch(`${SERVER_URL}/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(medicine)
      });

      if (response.status === 404) {
        console.warn('Server not deployed, using local storage');
        setMedicines(prev => [...prev, medicine]);
        return;
      }

      if (response.ok) {
        await loadMedicines(); // Reload to get the server-assigned ID
      } else {
        console.error('Failed to add medicine:', await response.text());
        // Fallback to local
        setMedicines(prev => [...prev, medicine]);
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      // Fallback to local
      setMedicines(prev => [...prev, medicine]);
    }
  };

  const updateMedicine = async (id: string, updatedMedicine: Partial<Medicine>) => {
    try {
      const response = await fetch(`${SERVER_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updatedMedicine)
      });

      if (response.status === 404) {
        console.warn('Server not deployed, using local storage');
        setMedicines(prev => prev.map(med => med.id === id ? { ...med, ...updatedMedicine } : med));
        return;
      }

      if (response.ok) {
        await loadMedicines(); // Reload to sync
      } else {
        console.error('Failed to update medicine:', await response.text());
        setMedicines(prev => prev.map(med => med.id === id ? { ...med, ...updatedMedicine } : med));
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      setMedicines(prev => prev.map(med => med.id === id ? { ...med, ...updatedMedicine } : med));
    }
  };

  const deleteMedicine = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/medicines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.status === 404) {
        console.warn('Server not deployed, using local storage');
        setMedicines(prev => prev.filter(med => med.id !== id));
        return;
      }

      if (response.ok) {
        await loadMedicines(); // Reload to sync
      } else {
        console.error('Failed to delete medicine:', await response.text());
        setMedicines(prev => prev.filter(med => med.id !== id));
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      setMedicines(prev => prev.filter(med => med.id !== id));
    }
  };

  const addAppointment = async (appointment: Appointment) => {
    try {
      const response = await fetch(`${SERVER_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(appointment)
      });

      if (response.status === 404) {
        console.warn('Server not deployed, using local storage');
        setAppointments(prev => [...prev, appointment]);
        return;
      }

      if (response.ok) {
        await loadAppointments(); // Reload to get the server-assigned ID
      } else {
        console.error('Failed to add appointment:', await response.text());
        setAppointments(prev => [...prev, appointment]);
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      setAppointments(prev => [...prev, appointment]);
    }
  };

  const updateAppointment = async (id: string, updatedAppointment: Partial<Appointment>) => {
    try {
      const response = await fetch(`${SERVER_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updatedAppointment)
      });

      if (response.status === 404) {
        console.warn('Server not deployed, using local storage');
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedAppointment } : apt));
        return;
      }

      if (response.ok) {
        await loadAppointments(); // Reload to sync
      } else {
        console.error('Failed to update appointment:', await response.text());
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedAppointment } : apt));
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedAppointment } : apt));
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.status === 404) {
        console.warn('Server not deployed, using local storage');
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        return;
      }

      if (response.ok) {
        await loadAppointments(); // Reload to sync
      } else {
        console.error('Failed to delete appointment:', await response.text());
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        currentStudentId,
        setCurrentStudentId,
        medicines,
        setMedicines,
        appointments,
        setAppointments,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        loadMedicines,
        loadAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
