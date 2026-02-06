import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, ShoppingBag, Car, Plus, MapPin, Clock, DollarSign } from 'lucide-react';

export function StudentExchange() {
  const [activeSection, setActiveSection] = useState<'lost-found' | 'marketplace' | 'travel'>('marketplace');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Student Exchange</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('lost-found')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSection === 'lost-found'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Lost & Found
          </button>
          <button
            onClick={() => setActiveSection('marketplace')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSection === 'marketplace'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Marketplace
          </button>
          <button
            onClick={() => setActiveSection('travel')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSection === 'travel'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Car className="w-4 h-4 inline mr-2" />
            Travel Sharing
          </button>
        </div>
      </div>

      {activeSection === 'lost-found' && <LostFound />}
      {activeSection === 'marketplace' && <Marketplace />}
      {activeSection === 'travel' && <TravelSharing />}
    </div>
  );
}

function LostFound() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    status: 'lost',
    location: '',
    contact_info: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data } = await supabase
      .from('lost_found')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setItems(data);
    } else {
      setItems([
        {
          id: '1',
          title: 'Black Backpack',
          description: 'Lost near Library Block. Contains laptop and notebooks.',
          status: 'lost',
          location: 'Library Block',
          contact_info: '9876543210',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Calculator Found',
          description: 'Scientific calculator found in Lecture Hall 3.',
          status: 'found',
          location: 'Lecture Hall 3',
          contact_info: '9876543211',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('lost_found').insert({
      ...newItem,
      item_type: 'general',
      created_by: userData?.user?.id
    });

    if (!error) {
      setNewItem({ title: '', description: '', status: 'lost', location: '', contact_info: '' });
      setShowForm(false);
      loadItems();
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(item => item.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`px-4 py-2 rounded-lg ${filter === 'lost' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Lost
          </button>
          <button
            onClick={() => setFilter('found')}
            className={`px-4 py-2 rounded-lg ${filter === 'found' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Found
          </button>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Report Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Report Lost/Found Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
              <input
                type="text"
                value={newItem.contact_info}
                onChange={(e) => setNewItem({ ...newItem, contact_info: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {item.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{item.description}</p>
            {item.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
            )}
            {item.contact_info && (
              <div className="text-sm text-blue-600 font-medium">
                Contact: {item.contact_info}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Marketplace() {
  const [listings, setListings] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: 'books',
    price: '',
    condition: 'good',
    contact_info: ''
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    let query = supabase
      .from('marketplace')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    const { data } = await query;

    if (data && data.length > 0) {
      setListings(data);
    } else {
      setListings([
        {
          id: '1',
          title: 'Data Structures Textbook',
          description: 'Cormen book, excellent condition. Used for one semester.',
          category: 'books',
          price: 450,
          condition: 'excellent',
          contact_info: '9876543210',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'HP Laptop',
          description: 'i5, 8GB RAM, 256GB SSD. 2 years old.',
          category: 'electronics',
          price: 25000,
          condition: 'good',
          contact_info: '9876543211',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Study Table',
          description: 'Wooden study table with drawer. Good condition.',
          category: 'furniture',
          price: 1200,
          condition: 'good',
          contact_info: '9876543212',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('marketplace').insert({
      ...newListing,
      price: parseFloat(newListing.price),
      created_by: userData?.user?.id
    });

    if (!error) {
      setNewListing({ title: '', description: '', category: 'books', price: '', condition: 'good', contact_info: '' });
      setShowForm(false);
      loadListings();
    }
  };

  const filteredListings = category === 'all' ? listings : listings.filter(l => l.category === category);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Categories</option>
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="cycles">Cycles</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          New Listing
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Create Listing</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newListing.category}
                  onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="books">Books</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="cycles">Cycles</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={newListing.condition}
                  onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
              <input
                type="text"
                value={newListing.contact_info}
                onChange={(e) => setNewListing({ ...newListing, contact_info: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Create Listing
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900">{listing.title}</h3>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                {listing.category}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{listing.description}</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                <DollarSign className="w-5 h-5" />
                ₹{listing.price}
              </div>
              <span className="text-sm text-gray-600">{listing.condition}</span>
            </div>
            {listing.contact_info && (
              <div className="text-sm text-blue-600 font-medium">
                Contact: {listing.contact_info}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TravelSharing() {
  const [trips, setTrips] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    departure_date: '',
    departure_time: '',
    seats_available: '',
    cost_per_person: '',
    pickup_location: '',
    notes: ''
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('travel_sharing')
      .select('*')
      .gte('departure_date', today)
      .order('departure_date');

    if (data && data.length > 0) {
      setTrips(data);
    } else {
      setTrips([
        {
          id: '1',
          destination: 'Chandigarh Airport',
          departure_date: '2026-02-10',
          departure_time: '06:00',
          seats_available: 2,
          cost_per_person: 200,
          pickup_location: 'Main Gate',
          notes: 'Early morning flight',
          passengers: []
        },
        {
          id: '2',
          destination: 'Delhi',
          departure_date: '2026-02-12',
          departure_time: '10:00',
          seats_available: 3,
          cost_per_person: 300,
          pickup_location: 'Hostel Block',
          notes: 'Weekend trip',
          passengers: []
        }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('travel_sharing').insert({
      ...newTrip,
      seats_available: parseInt(newTrip.seats_available),
      cost_per_person: parseFloat(newTrip.cost_per_person),
      created_by: userData?.user?.id,
      passengers: []
    });

    if (!error) {
      setNewTrip({ destination: '', departure_date: '', departure_time: '', seats_available: '', cost_per_person: '', pickup_location: '', notes: '' });
      setShowForm(false);
      loadTrips();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create Trip
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Create Travel Sharing</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <input
                  type="text"
                  value={newTrip.pickup_location}
                  onChange={(e) => setNewTrip({ ...newTrip, pickup_location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newTrip.departure_date}
                  onChange={(e) => setNewTrip({ ...newTrip, departure_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={newTrip.departure_time}
                  onChange={(e) => setNewTrip({ ...newTrip, departure_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seats Available</label>
                <input
                  type="number"
                  value={newTrip.seats_available}
                  onChange={(e) => setNewTrip({ ...newTrip, seats_available: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Person (₹)</label>
                <input
                  type="number"
                  value={newTrip.cost_per_person}
                  onChange={(e) => setNewTrip({ ...newTrip, cost_per_person: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={newTrip.notes}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 h-20"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
            >
              Create Trip
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{trip.destination}</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{new Date(trip.departure_date).toLocaleDateString()} at {trip.departure_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Pickup: {trip.pickup_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-500" />
                <span>{trip.seats_available} seats available</span>
              </div>
              {trip.cost_per_person && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  <span>₹{trip.cost_per_person} per person</span>
                </div>
              )}
            </div>
            {trip.notes && (
              <p className="mt-3 text-sm text-gray-600 italic">{trip.notes}</p>
            )}
            <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Join Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
