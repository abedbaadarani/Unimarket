import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setFetchingItem(true);
      const response = await itemsAPI.getOne(id);
      const item = response.data.item;
      
      setTitle(item.title);
      setDescription(item.description);
      setPrice(item.price.toString());
      setCategory(item.category);
    } catch (error) {
      setError('Failed to load item');
      console.error('Fetch item error:', error);
    } finally {
      setFetchingItem(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await itemsAPI.update(id, {
        title,
        description,
        price: parseFloat(price),
        category,
      });

      navigate(`/items/${id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update item');
      console.error('Update item error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Edit Item</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="label">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-solid disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/items/${id}`)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;

