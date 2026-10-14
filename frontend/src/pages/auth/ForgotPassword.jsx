import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h1>
          <p className="text-xs text-slate-500 mt-1">Enter your email and we'll send a recovery link</p>
        </div>
        <form className="space-y-4">
          <Input label="Email" type="email" placeholder="you@domain.com" />
          <Button type="button" className="w-full">Send Reset Instructions</Button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
