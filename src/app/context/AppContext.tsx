import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  medicines: Medicine[];
  setMedicines: (medicines: Medicine[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
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
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const addMedicine = (medicine: Medicine) => {
    setMedicines(prev => [...prev, medicine]);
  };

  const updateMedicine = (id: string, updatedMedicine: Partial<Medicine>) => {
    setMedicines(prev => prev.map(med => med.id === id ? { ...med, ...updatedMedicine } : med));
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id));
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedAppointment } : apt));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
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
