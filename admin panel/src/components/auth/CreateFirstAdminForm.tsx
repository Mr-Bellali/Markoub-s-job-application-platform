import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { createAdminSchema } from '../../types/auth.validator';
import { createAdmin } from '../../services/admins';

interface CreateAdminProps {
    onLogin: () => void;
}

const CreateFirstAdminForm = ({ onLogin }: CreateAdminProps) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
    }>({});
    const [showPassword, setShowPassword] = useState(false);

    const createAdminMutation = useMutation({
        mutationFn: createAdmin,
        onSuccess: (data: any) => {
            toast.success(`Admin account created successfully! Welcome, ${data.account.firstName}!`);
            login(data.token, data.account);
            navigate('/dashboard');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create admin. Please try again.');
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Validate with Zod
        const validation = createAdminSchema.safeParse({
            firstName,
            lastName,
            email,
            password,
        });

        if (!validation.success) {
            const fieldErrors: {
                firstName?: string;
                lastName?: string;
                email?: string;
                password?: string;
            } = {};
            validation.error.issues.forEach((err: any) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as 'firstName' | 'lastName' | 'email' | 'password'] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        createAdminMutation.mutate({
            firstName,
            lastName,
            email,
            password,
            role: 'superadmin',
        });
    };

    return (
        <section className="flex flex-col items-start w-full gap-10">
            <div className='w-full flex flex-col gap-2'>
                <h1 className='w-full flex items-center justify-center text-6xl font-bold'>
                    Create admin
                </h1>
                <p className='w-full flex items-center justify-center text-gray-400'>
                    *This is not a sign up page it's only to create the first admin
                </p>
            </div>

            <form className="flex flex-col items-start w-full" onSubmit={handleSubmit}>
                <label htmlFor="firstName" className="text-gray-700 font-medium mb-2">First name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Hamid"
                    className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                        errors.firstName
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                            : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                    }`}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm mb-6">{errors.firstName}</p>
                )}
                {!errors.firstName && <div className="mb-6" />}

                <label htmlFor="lastName" className="text-gray-700 font-medium mb-2">Last name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Alaoui"
                    className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                        errors.lastName
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                            : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                    }`}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm mb-6">{errors.lastName}</p>
                )}
                {!errors.lastName && <div className="mb-6" />}

                <label htmlFor="email" className="text-gray-700 font-medium mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
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

                <button
                    type="submit"
                    className="w-full p-4 bg-[#ff6804] rounded-xl font-bold text-xl text-white cursor-pointer hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={createAdminMutation.isPending}
                >
                    {createAdminMutation.isPending ? <Loader className="animate-spin" size={24} /> : 'Create'}
                </button>
            </form>
            <p className="text-sm text-gray-400">
                Already have an account? <span className="text-[#ff6804] cursor-pointer" onClick={onLogin}>Login</span>
            </p>
        </section>
    );
};

export default CreateFirstAdminForm;