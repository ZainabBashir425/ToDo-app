// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-3 md:container md:mx-auto my-10 p-6 bg-violet-100 md:w-1/3 rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="p-2 rounded" required />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="p-2 rounded" required />
        <button className="bg-slate-700 text-white p-2 rounded">Login</button>
      </form>
      <div className="mt-3">
        No account? <Link to="/signup" className="text-blue-700">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
