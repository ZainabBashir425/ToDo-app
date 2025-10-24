// src/pages/Signup.jsx
import { useState, useContext,useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await signup(name, email, password);
      navigate('/login');
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="mx-3 md:container md:mx-auto my-10 p-6 bg-violet-100 md:w-1/3 rounded">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name" className="p-2 rounded" required />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="p-2 rounded" required />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="p-2 rounded" minLength={6} required />
        <button className="bg-slate-700 text-white p-2 rounded">Sign Up</button>
      </form>
      <div className="mt-3">
        Already have an account? <Link to="/login" className="text-blue-700">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
