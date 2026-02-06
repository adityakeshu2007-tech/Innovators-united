/*
  # Project Nexus - Campus Super-App Database Schema
  
  ## Overview
  Complete database schema for the campus super-app with all core pillars
  
  ## New Tables
  
  ### User Profiles
  - `profiles` - Extended user information
  
  ### Daily Pulse Module
  - `mess_menu` - Daily mess menu with meals
  - `mail_summaries` - AI-summarized emails and announcements
  - `announcements` - Campus announcements
  
  ### Student Exchange Module
  - `lost_found` - Lost and found items
  - `marketplace` - Buy/sell marketplace listings
  - `travel_sharing` - Cab-pool coordination
  
  ### Explorer's Guide Module
  - `nearby_places` - Local attractions and eateries
  - `place_reviews` - User reviews for places
  
  ### Academic Cockpit Module
  - `timetable` - Student class schedules
  - `assignments` - Course assignments
  - `grades` - Student grades
  - `courses` - Course information
  
  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Public read access where appropriate
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'student',
  department text,
  year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Mess Menu Table
CREATE TABLE IF NOT EXISTS mess_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_type text NOT NULL,
  items text[] NOT NULL,
  date date NOT NULL,
  ratings jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mess_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mess menu"
  ON mess_menu FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage mess menu"
  ON mess_menu FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Mail Summaries Table (AI Feature)
CREATE TABLE IF NOT EXISTS mail_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  original_content text NOT NULL,
  summary text NOT NULL,
  category text,
  priority integer DEFAULT 1,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

ALTER TABLE mail_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all mail summaries"
  ON mail_summaries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create mail summaries"
  ON mail_summaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text,
  priority text DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'faculty')
    )
  );

-- Lost & Found Table
CREATE TABLE IF NOT EXISTS lost_found (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'lost',
  location text,
  image_url text,
  contact_info text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  resolved boolean DEFAULT false
);

ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lost & found items"
  ON lost_found FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create lost & found items"
  ON lost_found FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own items"
  ON lost_found FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Marketplace Table
CREATE TABLE IF NOT EXISTS marketplace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  condition text,
  image_url text,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  contact_info text
);

ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view marketplace items"
  ON marketplace FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create marketplace listings"
  ON marketplace FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own listings"
  ON marketplace FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own listings"
  ON marketplace FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Travel Sharing Table
CREATE TABLE IF NOT EXISTS travel_sharing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination text NOT NULL,
  departure_date date NOT NULL,
  departure_time time NOT NULL,
  seats_available integer NOT NULL,
  cost_per_person numeric,
  pickup_location text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  passengers uuid[] DEFAULT ARRAY[]::uuid[]
);

ALTER TABLE travel_sharing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view travel sharing"
  ON travel_sharing FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create travel sharing"
  ON travel_sharing FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own travel plans"
  ON travel_sharing FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Nearby Places Table
CREATE TABLE IF NOT EXISTS nearby_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  address text,
  vibe_tags text[] DEFAULT ARRAY[]::text[],
  image_url text,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nearby_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view nearby places"
  ON nearby_places FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add nearby places"
  ON nearby_places FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Place Reviews Table
CREATE TABLE IF NOT EXISTS place_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid REFERENCES nearby_places(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  review text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

ALTER TABLE place_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reviews"
  ON place_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON place_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  instructor text,
  credits integer DEFAULT 3,
  department text,
  semester text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  room text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timetable"
  ON timetable FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own timetable"
  ON timetable FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  total_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty can manage assignments"
  ON assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'faculty')
    )
  );

-- Grades Table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score numeric,
  feedback text,
  submitted_at timestamptz,
  graded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own grades"
  ON grades FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Faculty can manage grades"
  ON grades FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'faculty')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mess_menu_date ON mess_menu(date);
CREATE INDEX IF NOT EXISTS idx_mail_summaries_created_at ON mail_summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace(category);
CREATE INDEX IF NOT EXISTS idx_travel_sharing_date ON travel_sharing(departure_date);
CREATE INDEX IF NOT EXISTS idx_timetable_user ON timetable(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
