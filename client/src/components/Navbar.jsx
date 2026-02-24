import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              UniMarket
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/post-item" className="text-gray-700 hover:text-blue-600">
                  Post Item
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-blue-600">
                  Favorites
                </Link>
                <Link to="/my-listings" className="text-gray-700 hover:text-blue-600">
                  My Listings
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Hi, {user?.firstName}</span>
                  <button onClick={handleLogout} className="btn-outline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-solid">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

