import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI, uploadAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

const PostItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadAPI.uploadImage(file);
      const url = response.data.url;
      setPhotos([...photos, url]);
    } catch (error) {
      setError('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhotoUrl = () => {
    if (photoUrl.trim()) {
      setPhotos([...photos, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create item
      const response = await itemsAPI.create({
        title,
        description,
        price: parseFloat(price),
        category,
      });

      const itemId = response.data.item.id;

      // Add photos to item
      for (const photo of photos) {
        await itemsAPI.addPhoto(itemId, photo);
      }

      navigate(`/items/${itemId}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create item');
      console.error('Create item error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Post New Item</h2>

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

          <div>
            <label className="label">Photos</label>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="btn-outline"
                >
                  Add URL
                </button>
              </div>

              <div className="text-center text-gray-500">or</div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="input"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              </div>
            </div>

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={photo.startsWith('http') ? photo : `http://localhost:5000${photo}`}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full btn-solid disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Post Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;

