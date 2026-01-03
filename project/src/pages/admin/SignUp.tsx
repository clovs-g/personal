import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

type FormData = yup.InferType<typeof schema>;

const SignUp: React.FC = () => {
  const { isDark } = useThemeStore();
  const { signUp } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password);
      toast.success('Account created! You can now log in.');
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto rounded-lg shadow-sm flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white'}`}>
              <User className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            </div>
            <h2 className={`text-2xl font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Sign Up</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create a new admin account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;
