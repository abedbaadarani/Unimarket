import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getMyListings();
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await itemsAPI.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link to="/post-item" className="btn-solid">
          Post New Item
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't posted any items yet.</p>
          <Link to="/post-item" className="btn-solid">
            Post Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card">
              <Link to={`/items/${item.id}`}>
                <div className="aspect-square bg-gray-200 relative">
                  {item.photos && item.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000${item.photos[0].url}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/items/${item.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate hover:text-blue-600">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ${item.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {item.category}
                  </span>
                  <span>❤️ {item._count.favorites}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/items/${item.id}/edit`}
                    className="flex-1 text-center btn-outline text-sm py-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 btn-danger text-sm py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;

