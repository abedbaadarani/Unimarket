import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import ItemDetails from './pages/ItemDetails';
import Favorites from './pages/Favorites';
import MyListings from './pages/MyListings';
import EditItem from './pages/EditItem';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        
        {/* Protected Routes */}
        <Route
          path="/post-item"
          element={
            <ProtectedRoute>
              <PostItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id/edit"
          element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

