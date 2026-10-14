import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../lib/validations';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to sign in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30 mb-3">
            TF
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to your Taskflow workspace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@domain.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-between items-center text-xs">
            <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
