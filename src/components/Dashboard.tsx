import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Utensils,
  ShoppingBag,
  Package,
  Car,
  Map,
  BookOpen,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { DailyPulse } from './modules/DailyPulse';
import { StudentExchange } from './modules/StudentExchange';
import { ExplorerGuide } from './modules/ExplorerGuide';
import { AcademicCockpit } from './modules/AcademicCockpit';

type Tab = 'home' | 'pulse' | 'exchange' | 'explore' | 'academic';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'pulse' as Tab, label: 'Daily Pulse', icon: Utensils },
    { id: 'exchange' as Tab, label: 'Exchange', icon: ShoppingBag },
    { id: 'explore' as Tab, label: 'Explorer', icon: Map },
    { id: 'academic' as Tab, label: 'Academic', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Project Nexus
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{profile?.full_name}</span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'pulse' && <DailyPulse />}
        {activeTab === 'exchange' && <StudentExchange />}
        {activeTab === 'explore' && <ExplorerGuide />}
        {activeTab === 'academic' && <AcademicCockpit />}
      </main>
    </div>
  );
}

function HomeView() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to Project Nexus</h2>
        <p className="text-blue-100 text-lg">
          Your unified campus super-app powered by AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={Utensils}
          title="Daily Pulse"
          description="Mess menu, mail summaries & announcements"
          color="from-orange-500 to-red-500"
        />
        <FeatureCard
          icon={ShoppingBag}
          title="Student Exchange"
          description="Buy, sell, share rides & find lost items"
          color="from-green-500 to-emerald-500"
        />
        <FeatureCard
          icon={Map}
          title="Explorer's Guide"
          description="Discover local attractions & hidden gems"
          color="from-blue-500 to-cyan-500"
        />
        <FeatureCard
          icon={BookOpen}
          title="Academic Cockpit"
          description="Timetable, assignments & grades"
          color="from-violet-500 to-purple-500"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard label="Active Users" value="1,234" icon={User} />
        <StatCard label="Marketplace Items" value="156" icon={Package} />
        <StatCard label="Shared Rides" value="89" icon={Car} />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{label}</span>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
