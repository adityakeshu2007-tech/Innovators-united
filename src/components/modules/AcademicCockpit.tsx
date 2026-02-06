import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, BookOpen, Trophy, Clock, TrendingUp, Target, Sparkles } from 'lucide-react';

export function AcademicCockpit() {
  const [activeSection, setActiveSection] = useState<'timetable' | 'assignments' | 'grades'>('timetable');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Academic Cockpit</h2>
        <p className="text-violet-100">Your command center for academic success</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('timetable')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSection === 'timetable'
              ? 'bg-violet-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Timetable
        </button>
        <button
          onClick={() => setActiveSection('assignments')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSection === 'assignments'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Assignments
        </button>
        <button
          onClick={() => setActiveSection('grades')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSection === 'grades'
              ? 'bg-pink-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-2" />
          Grades
        </button>
      </div>

      {activeSection === 'timetable' && <Timetable />}
      {activeSection === 'assignments' && <Assignments />}
      {activeSection === 'grades' && <Grades />}
    </div>
  );
}

function Timetable() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('timetable')
      .select('*, courses(*)')
      .eq('user_id', userData?.user?.id)
      .order('day_of_week')
      .order('start_time');

    if (data && data.length > 0) {
      setSchedule(data);
    } else {
      setSchedule([
        {
          id: '1',
          day_of_week: 1,
          start_time: '09:00',
          end_time: '10:00',
          room: 'LH-101',
          courses: { code: 'CS201', name: 'Data Structures', instructor: 'Dr. Sharma' }
        },
        {
          id: '2',
          day_of_week: 1,
          start_time: '10:00',
          end_time: '11:00',
          room: 'LH-102',
          courses: { code: 'MA201', name: 'Linear Algebra', instructor: 'Dr. Kumar' }
        },
        {
          id: '3',
          day_of_week: 2,
          start_time: '09:00',
          end_time: '10:00',
          room: 'LH-103',
          courses: { code: 'CS202', name: 'Algorithms', instructor: 'Dr. Singh' }
        },
        {
          id: '4',
          day_of_week: 2,
          start_time: '11:00',
          end_time: '12:00',
          room: 'Lab-1',
          courses: { code: 'CS201L', name: 'Data Structures Lab', instructor: 'TA Team' }
        },
        {
          id: '5',
          day_of_week: 3,
          start_time: '14:00',
          end_time: '15:00',
          room: 'LH-101',
          courses: { code: 'CS203', name: 'Database Systems', instructor: 'Dr. Patel' }
        }
      ]);
    }
    setLoading(false);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().getDay();

  const getClassesForDay = (day: number) => {
    return schedule.filter(s => s.day_of_week === day);
  };

  if (loading) {
    return <div className="text-center py-12">Loading timetable...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="font-bold text-gray-900">Today's Schedule</h3>
        </div>
        <div className="space-y-3">
          {getClassesForDay(today === 0 ? 7 : today).length > 0 ? (
            getClassesForDay(today === 0 ? 7 : today).map((cls) => (
              <div key={cls.id} className="flex items-center gap-4 p-4 bg-violet-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{cls.courses.name}</h4>
                  <p className="text-sm text-gray-600">{cls.courses.code} • {cls.courses.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{cls.start_time} - {cls.end_time}</p>
                  <p className="text-sm text-gray-600">{cls.room}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No classes today! Enjoy your free time.
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.slice(0, 6).map((day, idx) => {
          const dayNum = idx + 1;
          return (
          <div key={day} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className={`font-bold mb-3 ${dayNum === (today === 0 ? 7 : today) ? 'text-violet-600' : 'text-gray-900'}`}>
              {day}
            </h3>
            <div className="space-y-2">
              {getClassesForDay(dayNum).length > 0 ? (
                getClassesForDay(dayNum).map((cls) => (
                  <div key={cls.id} className="text-sm p-2 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">{cls.courses.code}</p>
                    <p className="text-gray-600">{cls.start_time} • {cls.room}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No classes</p>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}

function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const { data } = await supabase
      .from('assignments')
      .select('*, courses(*)')
      .gte('due_date', new Date().toISOString())
      .order('due_date');

    if (data && data.length > 0) {
      setAssignments(data);
    } else {
      setAssignments([
        {
          id: '1',
          title: 'Binary Search Tree Implementation',
          description: 'Implement BST with insert, delete, and search operations',
          due_date: '2026-02-15T23:59:00',
          total_points: 100,
          courses: { code: 'CS201', name: 'Data Structures' }
        },
        {
          id: '2',
          title: 'Matrix Operations Assignment',
          description: 'Solve problems on matrix multiplication and determinants',
          due_date: '2026-02-18T23:59:00',
          total_points: 50,
          courses: { code: 'MA201', name: 'Linear Algebra' }
        },
        {
          id: '3',
          title: 'Sorting Algorithms Analysis',
          description: 'Compare time complexity of various sorting algorithms',
          due_date: '2026-02-20T23:59:00',
          total_points: 75,
          courses: { code: 'CS202', name: 'Algorithms' }
        }
      ]);
    }
    setLoading(false);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div className="text-center py-12">Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">AI Study Planner</h3>
        </div>
        <p className="text-gray-700 mb-4">Based on your deadlines, here's the recommended study schedule:</p>
        <div className="space-y-2">
          {assignments.slice(0, 3).map((assignment) => {
            const days = getDaysUntilDue(assignment.due_date);
            const hoursNeeded = Math.ceil(assignment.total_points / 25);
            return (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-sm text-gray-600">{assignment.courses.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600">~{hoursNeeded} hours needed</p>
                  <p className="text-xs text-gray-500">Start {days - 2} days before due</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const daysUntil = getDaysUntilDue(assignment.due_date);
          return (
            <div key={assignment.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.courses.code} • {assignment.courses.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  daysUntil <= 2 ? 'bg-red-100 text-red-700' :
                  daysUntil <= 5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {daysUntil} days left
                </span>
              </div>
              <p className="text-gray-700 mb-4">{assignment.description}</p>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(assignment.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>{assignment.total_points} points</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Submit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Grades() {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('grades')
      .select('*, assignments(*, courses(*))')
      .eq('student_id', userData?.user?.id)
      .not('score', 'is', null)
      .order('graded_at', { ascending: false });

    if (data && data.length > 0) {
      setGrades(data);
    } else {
      setGrades([
        {
          id: '1',
          score: 85,
          feedback: 'Good implementation, but could optimize the delete operation.',
          assignments: {
            title: 'Linked List Implementation',
            total_points: 100,
            courses: { code: 'CS201', name: 'Data Structures' }
          },
          graded_at: '2026-01-25T10:00:00'
        },
        {
          id: '2',
          score: 92,
          feedback: 'Excellent work! Very clear solution steps.',
          assignments: {
            title: 'Matrix Operations',
            total_points: 100,
            courses: { code: 'MA201', name: 'Linear Algebra' }
          },
          graded_at: '2026-01-28T14:30:00'
        },
        {
          id: '3',
          score: 78,
          feedback: 'Time complexity analysis needs more detail.',
          assignments: {
            title: 'Sorting Analysis',
            total_points: 100,
            courses: { code: 'CS202', name: 'Algorithms' }
          },
          graded_at: '2026-02-01T09:15:00'
        }
      ]);
    }
    setLoading(false);
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const avg = grades.reduce((sum, g) => sum + (g.score / g.assignments.total_points * 100), 0) / grades.length;
    return (avg / 10).toFixed(2);
  };

  const getPerformanceTrend = () => {
    if (grades.length < 2) return 'stable';
    const recent = grades.slice(0, 3);
    const older = grades.slice(3, 6);
    const recentAvg = recent.reduce((s, g) => s + g.score, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((s, g) => s + g.score, 0) / older.length : recentAvg;
    return recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
  };

  if (loading) {
    return <div className="text-center py-12">Loading grades...</div>;
  }

  const trend = getPerformanceTrend();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Current GPA</span>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{calculateGPA()}</p>
          <p className="text-sm text-gray-500 mt-1">out of 10.0</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Assignments Graded</span>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{grades.length}</p>
          <p className="text-sm text-gray-500 mt-1">this semester</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Performance</span>
            <TrendingUp className={`w-5 h-5 ${trend === 'improving' ? 'text-green-500' : trend === 'declining' ? 'text-red-500' : 'text-gray-500'}`} />
          </div>
          <p className="text-3xl font-bold text-gray-900 capitalize">{trend}</p>
          <p className="text-sm text-gray-500 mt-1">based on recent work</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-gray-900">AI Performance Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-gray-700">
              Your performance in <strong>Data Structures</strong> is strong. Keep up the good work!
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-gray-700">
              Consider spending more time on <strong>Algorithms</strong> - practice more problems for better understanding.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-700">
              Your recent trend is {trend === 'improving' ? 'positive' : trend === 'declining' ? 'concerning' : 'steady'}.
              {trend === 'improving' && ' Great momentum!'}
              {trend === 'declining' && ' Focus on fundamentals and seek help if needed.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Recent Grades</h3>
        {grades.map((grade) => {
          const percentage = (grade.score / grade.assignments.total_points * 100).toFixed(1);
          return (
            <div key={grade.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{grade.assignments.title}</h4>
                  <p className="text-sm text-gray-600">
                    {grade.assignments.courses.code} • {grade.assignments.courses.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{grade.score}/{grade.assignments.total_points}</p>
                  <p className={`text-sm font-medium ${
                    parseFloat(percentage) >= 90 ? 'text-green-600' :
                    parseFloat(percentage) >= 75 ? 'text-blue-600' :
                    parseFloat(percentage) >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {percentage}%
                  </p>
                </div>
              </div>
              {grade.feedback && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{grade.feedback}</p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Graded on {new Date(grade.graded_at).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
