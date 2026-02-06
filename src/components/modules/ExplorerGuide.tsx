import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Map, MapPin, Star, Coffee, Utensils, ShoppingCart, Heart, TrendingUp, Sparkles } from 'lucide-react';

export function ExplorerGuide() {
  const [places, setPlaces] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: 'restaurant',
    description: '',
    address: '',
    vibe_tags: [] as string[]
  });

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const { data } = await supabase
      .from('nearby_places')
      .select('*')
      .order('rating', { ascending: false });

    if (data && data.length > 0) {
      setPlaces(data);
    } else {
      setPlaces([
        {
          id: '1',
          name: 'Cafe Coffee Day',
          category: 'cafe',
          description: 'Perfect spot for study sessions with friends. Great coffee and WiFi.',
          address: 'Near Main Market, Rupnagar',
          vibe_tags: ['study-friendly', 'wifi', 'budget'],
          rating: 4.2,
          review_count: 45
        },
        {
          id: '2',
          name: 'Haveli Restaurant',
          category: 'restaurant',
          description: 'Authentic Punjabi cuisine. Perfect for weekend outings.',
          address: 'GT Road, Ropar',
          vibe_tags: ['family-friendly', 'punjabi', 'outdoor-seating'],
          rating: 4.5,
          review_count: 78
        },
        {
          id: '3',
          name: 'Anandpur Sahib',
          category: 'attraction',
          description: 'Historic Sikh pilgrimage site. Beautiful architecture and peaceful atmosphere.',
          address: 'Anandpur Sahib, 20km from campus',
          vibe_tags: ['historical', 'peaceful', 'cultural'],
          rating: 4.8,
          review_count: 156
        },
        {
          id: '4',
          name: 'Ropar Wetland',
          category: 'attraction',
          description: 'Great spot for bird watching and nature walks. Peaceful getaway.',
          address: 'Near Sutlej River',
          vibe_tags: ['nature', 'peaceful', 'photography'],
          rating: 4.3,
          review_count: 34
        },
        {
          id: '5',
          name: 'The Book Shop',
          category: 'shop',
          description: 'Local bookstore with great collection of novels and academic books.',
          address: 'Main Market, Rupnagar',
          vibe_tags: ['books', 'quiet', 'student-discount'],
          rating: 4.0,
          review_count: 23
        },
        {
          id: '6',
          name: 'Dominos Pizza',
          category: 'restaurant',
          description: 'Fast food favorite. Late night cravings sorted.',
          address: 'Sector 5, Rupnagar',
          vibe_tags: ['fast-food', 'late-night', 'delivery'],
          rating: 3.8,
          review_count: 92
        }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('nearby_places').insert({
      ...newPlace,
      rating: 0,
      review_count: 0
    });

    if (!error) {
      setNewPlace({ name: '', category: 'restaurant', description: '', address: '', vibe_tags: [] });
      setShowForm(false);
      loadPlaces();
    }
  };

  const addVibeTag = (tag: string) => {
    if (!newPlace.vibe_tags.includes(tag)) {
      setNewPlace({ ...newPlace, vibe_tags: [...newPlace.vibe_tags, tag] });
    }
  };

  const removeVibeTag = (tag: string) => {
    setNewPlace({ ...newPlace, vibe_tags: newPlace.vibe_tags.filter(t => t !== tag) });
  };

  const filteredPlaces = filter === 'all' ? places : places.filter(p => p.category === filter);

  const getRecommendedPlaces = () => {
    return places.sort((a, b) => b.rating * b.review_count - a.rating * a.review_count).slice(0, 3);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Explorer's Guide</h2>
        </div>
        <p className="text-cyan-100">Discover the best spots around Rupnagar & Ropar</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          AI Recommended for You
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {getRecommendedPlaces().map((place) => (
            <div key={place.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900">{place.name}</h4>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{place.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{place.description.slice(0, 60)}...</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('restaurant')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'restaurant' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Utensils className="w-4 h-4 inline mr-2" />
            Restaurants
          </button>
          <button
            onClick={() => setFilter('cafe')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'cafe' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Coffee className="w-4 h-4 inline mr-2" />
            Cafes
          </button>
          <button
            onClick={() => setFilter('attraction')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'attraction' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Attractions
          </button>
          <button
            onClick={() => setFilter('shop')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'shop' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Shops
          </button>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Place
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Add New Place</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Place Name</label>
                <input
                  type="text"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPlace.category}
                  onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="attraction">Attraction</option>
                  <option value="shop">Shop</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newPlace.description}
                onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={newPlace.address}
                onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vibe Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['study-friendly', 'budget', 'wifi', 'outdoor-seating', 'family-friendly', 'date-spot', 'late-night', 'student-discount'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addVibeTag(tag)}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-full text-sm"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {newPlace.vibe_tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <button type="button" onClick={() => removeVibeTag(tag)} className="hover:text-red-200">×</button>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Place
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              {place.category === 'restaurant' && <Utensils className="w-12 h-12 text-white" />}
              {place.category === 'cafe' && <Coffee className="w-12 h-12 text-white" />}
              {place.category === 'attraction' && <Map className="w-12 h-12 text-white" />}
              {place.category === 'shop' && <ShoppingCart className="w-12 h-12 text-white" />}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{place.name}</h3>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{place.description}</p>
              {place.address && (
                <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{place.address}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {place.vibe_tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-gray-900">{place.rating}</span>
                  <span className="text-sm text-gray-500">({place.review_count})</span>
                </div>
                <span className="text-xs text-gray-500 capitalize">{place.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
