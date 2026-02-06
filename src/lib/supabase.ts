import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department?: string;
  year?: number;
};

export type MessMenu = {
  id: string;
  meal_type: string;
  items: string[];
  date: string;
  ratings: any[];
};

export type MailSummary = {
  id: string;
  title: string;
  original_content: string;
  summary: string;
  category?: string;
  priority: number;
  tags: string[];
  created_at: string;
};

export type LostFoundItem = {
  id: string;
  item_type: string;
  title: string;
  description: string;
  status: string;
  location?: string;
  image_url?: string;
  contact_info?: string;
  created_at: string;
  resolved: boolean;
};

export type MarketplaceListing = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  condition?: string;
  image_url?: string;
  status: string;
  created_at: string;
  contact_info?: string;
};

export type TravelShare = {
  id: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  seats_available: number;
  cost_per_person?: number;
  pickup_location: string;
  notes?: string;
  created_at: string;
  passengers: string[];
};

export type NearbyPlace = {
  id: string;
  name: string;
  category: string;
  description?: string;
  address?: string;
  vibe_tags: string[];
  image_url?: string;
  rating: number;
  review_count: number;
};

export type Assignment = {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date: string;
  total_points: number;
  created_at: string;
};
