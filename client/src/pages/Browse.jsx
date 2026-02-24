import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

const Browse = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await itemsAPI.getAll(params);
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Items</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found. Be the first to post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.id} to={`/items/${item.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 relative">
                {item.photos && item.photos.length > 0 ? (
                  <img
                    src={item.photos[0].url.startsWith('data:') || item.photos[0].url.startsWith('http') ? item.photos[0].url : `http://localhost:5000${item.photos[0].url}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ${item.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {item.category}
                  </span>
                  <span>❤️ {item._count.favorites}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
