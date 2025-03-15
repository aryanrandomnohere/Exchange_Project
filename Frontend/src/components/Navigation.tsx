import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, LogIn, Search, X, LogOut } from 'lucide-react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { profileState } from '../state/userState';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const isAuthenticated = localStorage.getItem('token');
  const [profile, setProfile] = useRecoilState(profileState);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const response = await axios.get('http://localhost:5001/api/v1/user/profile', {
          headers: {
            authorization: `${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
    
    if (isAuthenticated) {
      getProfile();
    }
  }, [isAuthenticated, setProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfile({
      id: '',
      username: '',
      email: '',
      balance: 0,
      password: ''
    });
    setShowProfileModal(false);
    navigate('/auth');
  };

  // Click outside handler
  useEffect(() => {
    //@ts-ignore
    //@ts-ignore
    function handleClickOutside(event) {
      //@ts-ignore
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);
//@ts-ignore
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">Exchange</Link>
          </div>
          {/* Search Input */}
          <div className="relative w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stocks..."
              className="w-full min-w-96 pl-10 pr-10 py-2 border border-black/20 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-2.5 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/auth') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <div 
                  className="px-4 py-2.5 rounded-full bg-gray-400 text-white cursor-pointer flex items-center justify-center"
                  onMouseEnter={() => setShowProfileModal(true)}
                >
                  {profile.username ? profile.username[0].toUpperCase() : 'U'}
                </div>
                
                {/* Profile Modal */}
                {showProfileModal && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{profile.username}</p>
                      <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                    </div>
                    <div className="px-4 py-2">
                      <p className="text-sm text-gray-700">Balance: ${profile.balance.toFixed(2)}</p>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;