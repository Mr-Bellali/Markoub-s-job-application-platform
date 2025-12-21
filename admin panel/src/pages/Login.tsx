import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import MarkoubImage from '../assets/Markoub.png';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: Implement actual login logic with API
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="w-full h-screen flex flex-row">
            {/* Left-side */}
            <div className='w-2/3 h-full bg-orange-400'>
                <img src={MarkoubImage} alt="Markoub" className="w-full h-full object-cover" />
            </div>
            {/* Right-side */}
            {/* Form part */}
            <div className='w-1/3 h-full flex flex-col p-4 items-center justify-center'>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
