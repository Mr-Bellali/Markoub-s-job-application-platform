import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { loginAdmin } from '../../services/auth';
import { loginSchema } from '../../types/auth.validator';

interface LoginFormProps {
  onCreateAccount: () => void;
}

const LoginForm = ({ onCreateAccount }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.account.firstName}!`);
      login(data.token, data.account);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate with Zod
    const validation = loginSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'email' | 'password'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <section className="flex flex-col items-start w-full gap-10">
      {/* Title */}
      <h1 className="text-6xl font-bold w-full flex items-center justify-center">Login</h1>

      <form className="flex flex-col items-start w-full" onSubmit={handleSubmit}>
        <label htmlFor="email" className="text-gray-700 font-medium mb-2">Email</label>
        <input type="email" id="email" name="email"
          placeholder="yassine@gmail.com"
          className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
            errors.email 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400' 
              : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-6">{errors.email}</p>
        )}
        {!errors.email && <div className="mb-6" />}

        <label htmlFor="password" className="text-gray-700 font-medium mb-2">Password</label>
        <div className="relative w-full mb-2">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            name="password"
            placeholder="SecretPassword123"
            className={`w-full border rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 transition-colors ${
              errors.password 
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400' 
                : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mb-6">{errors.password}</p>
        )}
        {!errors.password && <div className="mb-6" />}

        <button type="submit"
          className="w-full p-4 bg-[#ff6804] rounded-xl font-bold text-xl text-white cursor-pointer hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? <Loader className="animate-spin" size={24} /> : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-400">
        Not registered? <span className="text-[#ff6804] cursor-pointer" onClick={onCreateAccount}>create a new account</span>
      </p>
    </section>
  )
}

export default LoginForm