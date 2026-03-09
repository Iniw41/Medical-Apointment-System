import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Stethoscope, User, Shield, CheckCircle } from 'lucide-react';
import logo from 'figma:asset/535fbbef6e8afe0ed959cbadbcaf6275e9f332d7.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserRole, setCurrentUser } = useApp();
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId && studentName) {
      setUserRole('student');
      setCurrentUser(studentName);
      navigate('/student');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, use proper backend auth
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setUserRole('admin');
      setCurrentUser(adminUsername);
      navigate('/admin');
    } else {
      alert('Invalid credentials. Use username: admin, password: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="CIT-U Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#800000]">CIT-U Medical</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#800000] to-[#600000] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white z-10">
              <h1 className="text-5xl font-bold mb-4">CIT-U HealthSuite</h1>
              <div className="space-y-3 text-xl mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B8860B]" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B8860B]" />
                  <span>Personalized Care</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B8860B]" />
                  <span>Quick Setup</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1770663734902-0f2440bc665c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFscyUyMGRvY3RvcnMlMjBudXJzZXMlMjBob3NwaXRhbHxlbnwxfHx8fDE3NzI4NTAzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Medical Professionals" 
                className="rounded-lg shadow-2xl opacity-90"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
      </div>

      {/* Login Section */}
      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#800000] mb-4">Access Your Health Portal</h2>
          <p className="text-gray-600">Student Health Services at Cebu Institute of Technology - University</p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 h-12">
            <TabsTrigger value="student" className="flex items-center gap-2 data-[state=active]:bg-[#800000] data-[state=active]:text-white text-base">
              <User className="w-5 h-5" />
              Student Portal
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-[#B8860B] data-[state=active]:text-white text-base">
              <Shield className="w-5 h-5" />
              Admin Portal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card className="border-2 border-[#800000] max-w-lg mx-auto shadow-xl">
              <CardHeader className="space-y-1 bg-gradient-to-br from-gray-50 to-white">
                <CardTitle className="text-2xl text-[#800000]">Student Login</CardTitle>
                <CardDescription className="text-base">
                  Enter your credentials to access medical services
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <form onSubmit={handleStudentLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-base">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="Enter your student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                      className="h-12 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentName" className="text-base">Full Name</Label>
                    <Input
                      id="studentName"
                      placeholder="Enter your full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="h-12 border-2 border-gray-300 focus-visible:ring-[#800000] focus-visible:border-[#800000]"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base bg-[#800000] hover:bg-[#600000] text-white">
                    Access Student Portal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="border-2 border-[#B8860B] max-w-lg mx-auto shadow-xl">
              <CardHeader className="space-y-1 bg-gradient-to-br from-amber-50 to-white">
                <CardTitle className="text-2xl text-[#800000]">Admin Login</CardTitle>
                <CardDescription className="text-base">
                  Authorized clinic staff only
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <form onSubmit={handleAdminLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="adminUsername" className="text-base">Username</Label>
                    <Input
                      id="adminUsername"
                      placeholder="Enter username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                      className="h-12 border-2 border-gray-300 focus-visible:ring-[#B8860B] focus-visible:border-[#B8860B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="text-base">Password</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Enter password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="h-12 border-2 border-gray-300 focus-visible:ring-[#B8860B] focus-visible:border-[#B8860B]"
                    />
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                    Demo credentials: <span className="font-mono">admin</span> / <span className="font-mono">admin123</span>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base bg-[#B8860B] hover:bg-[#DAA520] text-white">
                    Access Admin Panel
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}