// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex md:justify-between items-center gap-2 md:flex-row flex-col bg-slate-600 text-white py-2 px-4">
      <div className="logo">
        <Link to="/" className="font-bold text-xl">TodoTrack</Link>
      </div>
      <ul className="flex gap-6 items-center">
        {user ? (
          <>
            <li className="text-sm">Hello, {user.name}</li>
            <li><button onClick={logout} className="bg-slate-700 px-3 py-1 rounded">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="hover:font-bold">Login</Link></li>
            <li><Link to="/signup" className="hover:font-bold">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
