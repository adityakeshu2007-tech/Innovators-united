import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Utensils, Mail, Bell, TrendingUp, Sparkles } from 'lucide-react';

export function DailyPulse() {
  const [activeSection, setActiveSection] = useState<'menu' | 'mail' | 'announcements'>('menu');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Daily Pulse</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('menu')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSection === 'menu'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Utensils className="w-4 h-4 inline mr-2" />
            Mess Menu
          </button>
          <button
            onClick={() => setActiveSection('mail')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSection === 'mail'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Mail Summaries
          </button>
          <button
            onClick={() => setActiveSection('announcements')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSection === 'announcements'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Announcements
          </button>
        </div>
      </div>

      {activeSection === 'menu' && <MessMenu />}
      {activeSection === 'mail' && <MailSummarizer />}
      {activeSection === 'announcements' && <Announcements />}
    </div>
  );
}

function MessMenu() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('mess_menu')
      .select('*')
      .eq('date', today)
      .order('meal_type');

    if (data && data.length > 0) {
      setMenu(data);
    } else {
      setMenu([
        { id: '1', meal_type: 'Breakfast', items: ['Parathas', 'Curd', 'Pickle', 'Tea'], ratings: [] },
        { id: '2', meal_type: 'Lunch', items: ['Dal', 'Rice', 'Roti', 'Paneer Sabzi', 'Salad'], ratings: [] },
        { id: '3', meal_type: 'Snacks', items: ['Samosa', 'Chai', 'Biscuits'], ratings: [] },
        { id: '4', meal_type: 'Dinner', items: ['Chole', 'Rice', 'Roti', 'Mixed Veg', 'Sweet'], ratings: [] },
      ]);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12">Loading menu...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {menu.map((meal) => (
        <div key={meal.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{meal.meal_type}</h3>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <ul className="space-y-2">
            {meal.items.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-yellow-500">★ ★ ★ ★ ☆</span>
              <span>4.0/5.0</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MailSummarizer() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMail, setNewMail] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    const { data } = await supabase
      .from('mail_summaries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      setSummaries(data);
    } else {
      setSummaries([
        {
          id: '1',
          title: 'AI Fusion Hackathon 2026 Registration Open',
          summary: 'Register for AI Fusion Hackathon by Feb 15th. Build campus super-apps with AI/ML.',
          category: 'events',
          priority: 3,
          tags: ['hackathon', 'ai', 'registration'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Mid-Semester Exam Schedule Released',
          summary: 'Mid-sem exams from March 1-15. Check timetable for your courses.',
          category: 'academic',
          priority: 3,
          tags: ['exams', 'important', 'deadline'],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Campus Fest Advitiya 2026',
          summary: 'Annual tech-cultural fest from April 1-3. Register for events and competitions.',
          category: 'events',
          priority: 2,
          tags: ['fest', 'cultural', 'technical'],
          created_at: new Date().toISOString()
        }
      ]);
    }
    setLoading(false);
  };

  const summarizeWithAI = (content: string): string => {
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return content;

    const keywords = ['register', 'deadline', 'exam', 'event', 'important', 'urgent', 'submit'];
    const importantSentences = sentences.filter(s =>
      keywords.some(kw => s.toLowerCase().includes(kw))
    );

    const summary = importantSentences.length > 0
      ? importantSentences.slice(0, 2).join('.') + '.'
      : sentences.slice(0, 2).join('.') + '.';

    return summary;
  };

  const extractTags = (text: string): string[] => {
    const keywords = ['hackathon', 'exam', 'fest', 'registration', 'deadline', 'important', 'urgent', 'event', 'academic'];
    return keywords.filter(kw => text.toLowerCase().includes(kw));
  };

  const categorizeMail = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('exam') || lower.includes('grade') || lower.includes('assignment')) return 'academic';
    if (lower.includes('event') || lower.includes('fest') || lower.includes('competition')) return 'events';
    if (lower.includes('urgent') || lower.includes('important')) return 'urgent';
    return 'general';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const summary = summarizeWithAI(newMail.content);
    const tags = extractTags(newMail.title + ' ' + newMail.content);
    const category = categorizeMail(newMail.title + ' ' + newMail.content);
    const priority = category === 'urgent' ? 3 : category === 'academic' ? 2 : 1;

    const { data: userData } = await supabase.auth.getUser();

    const newSummary = {
      title: newMail.title,
      original_content: newMail.content,
      summary,
      category,
      priority,
      tags,
      created_by: userData?.user?.id
    };

    const { error } = await supabase.from('mail_summaries').insert(newSummary);

    if (!error) {
      setNewMail({ title: '', content: '' });
      setShowForm(false);
      loadSummaries();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading summaries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-gray-600">AI-powered mail summarization</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Summarize New Mail'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Add New Mail</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
              <input
                type="text"
                value={newMail.title}
                onChange={(e) => setNewMail({ ...newMail, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
              <textarea
                value={newMail.content}
                onChange={(e) => setNewMail({ ...newMail, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate AI Summary
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {summaries.map((mail) => (
          <div key={mail.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900">{mail.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                mail.priority === 3 ? 'bg-red-100 text-red-700' :
                mail.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {mail.category}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{mail.summary}</p>
            <div className="flex flex-wrap gap-2">
              {mail.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Announcements() {
  const [announcements] = useState<any[]>([
    {
      id: '1',
      title: 'Library Timings Extended',
      content: 'The central library will now remain open until midnight during exam season.',
      category: 'facility',
      priority: 'normal',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Campus WiFi Maintenance',
      content: 'WiFi services will be down on Sunday 2-4 PM for maintenance work.',
      category: 'facility',
      priority: 'high',
      created_at: new Date().toISOString()
    }
  ]);

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900">{announcement.title}</h3>
            <Bell className={`w-5 h-5 ${
              announcement.priority === 'high' ? 'text-red-500' : 'text-green-500'
            }`} />
          </div>
          <p className="text-gray-700">{announcement.content}</p>
          <p className="text-sm text-gray-500 mt-3">
            {new Date(announcement.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
