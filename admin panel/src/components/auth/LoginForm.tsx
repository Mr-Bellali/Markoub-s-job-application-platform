import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/auth';

interface LoginFormProps {
  onCreateAccount: () => void;
}

const LoginForm = ({ onCreateAccount }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.account);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      setError(error.message || 'Login failed. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    loginMutation.mutate({ email, password });
  };

  return (
    <section className="flex flex-col items-start w-full gap-10">
      {/* Title */}
      <h1 className="text-6xl font-bold w-full flex items-center justify-center">Login</h1>

      <form className="flex flex-col items-start w-full" onSubmit={handleSubmit}>
        {error && (
          <div className="w-full p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        
        <label htmlFor="email" >Email</label>
        <input type="email" id="email" name="email"
          placeholder="yassine@gmail.com"
          className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-10 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400"
          required
        />

        <label htmlFor="password">Password</label>
        <div className="relative w-full mb-10">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            name="password"
            placeholder="SecretPassword123"
            className="w-full border-[#e7e7e7] border rounded-xl p-4 pr-12 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit"
          className="w-full p-4 bg-[#ff6804] rounded-xl font-bold text-xl text-white cursor-pointer hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-400">
        Not registered? <span className="text-[#ff6804] cursor-pointer" onClick={onCreateAccount}>create a new account</span>
      </p>
    </section>
  )
}

export default LoginForm