import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onCreateAccount: () => void;
}

const LoginForm = ({ onCreateAccount }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // TODO: Replace with actual API call
    // Example: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    // const { token } = await response.json();
    
    // Simulate API call
    setTimeout(() => {
      const mockToken = 'mock-jwt-token-' + Date.now(); // Replace with actual token from API
      login(mockToken);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <section className="flex flex-col items-start w-full gap-10">
      {/* Title */}
      <h1 className="text-6xl font-bold w-full flex items-center justify-center">Login</h1>

      <form className="flex flex-col items-start w-full" onSubmit={handleSubmit}>
        <label htmlFor="email" >Email</label>
        <input type="email" id="email" name="email"
          placeholder="yassine@gmail.com"
          className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-10"
          required
        />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password"
          placeholder="SecretPassword123"
          className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-10"
          required
        />

        <button type="submit"
          className="w-full p-4 bg-[#ff6804] rounded-xl font-bold text-xl text-white cursor-pointer hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-400">
        Not registered? <span className="text-[#ff6804] cursor-pointer" onClick={onCreateAccount}>create a new account</span>
      </p>
    </section>
  )
}

export default LoginForm