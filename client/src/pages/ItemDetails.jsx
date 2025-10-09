import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [item, setItem] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchItem();
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getOne(id);
      setItem(response.data.item);
    } catch (error) {
      setError('Failed to load item');
      console.error('Fetch item error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await itemsAPI.getMyFavorites();
      const favoriteIds = response.data.items.map(item => item.id);
      setIsFavorited(favoriteIds.includes(parseInt(id)));
    } catch (error) {
      console.error('Check favorite error:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await itemsAPI.unfavorite(id);
        setIsFavorited(false);
      } else {
        await itemsAPI.favorite(id);
        setIsFavorited(true);
      }
      fetchItem(); // Refresh to update favorite count
    } catch (error) {
      console.error('Favorite toggle error:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await itemsAPI.delete(id);
      navigate('/my-listings');
    } catch (error) {
      setError('Failed to delete item');
      console.error('Delete item error:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || 'Item not found'}</p>
      </div>
    );
  }

  const isOwner = user && user.id === item.sellerId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photos */}
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {item.photos && item.photos.length > 0 ? (
              <img
                src={`http://localhost:5000${item.photos[currentPhotoIndex].url}`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {item.photos && item.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentPhotoIndex ? 'border-blue-600' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={`http://localhost:5000${photo.url}`}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.title}</h1>
            <p className="text-3xl font-bold text-blue-600">${item.price.toFixed(2)}</p>
          </div>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              {item.category}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Seller Information</h3>
            <p className="text-gray-700 font-medium">{item.seller.firstName} {item.seller.lastName}</p>
            <p className="text-gray-600 text-sm">{item.seller.email}</p>
            {!isOwner && item.seller.phone && (
              <div className="mt-3">
                <a
                  href={`tel:${item.seller.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  📞 Contact Seller: {item.seller.phone}
                </a>
              </div>
            )}
          </div>

          <div className="mb-6 text-gray-600 text-sm">
            <p>❤️ {item._count.favorites} favorites</p>
            <p>Posted {new Date(item.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3">
            {isOwner ? (
              <>
                <Link to={`/items/${item.id}/edit`} className="btn-solid flex-1 text-center">
                  Edit Item
                </Link>
                <button onClick={handleDelete} className="btn-danger flex-1">
                  Delete Item
                </button>
              </>
            ) : (
              <button
                onClick={handleFavoriteToggle}
                className={`w-full ${isFavorited ? 'btn-danger' : 'btn-solid'}`}
              >
                {isFavorited ? '❤️ Unfavorite' : '🤍 Favorite'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

