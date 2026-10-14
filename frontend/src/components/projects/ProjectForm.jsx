import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../lib/validations';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function ProjectForm({ initialData, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      color: '#4f46e5',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Name *"
        placeholder="e.g. Mobile Companion App"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Brief description of the project..."
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          {...register('description')}
        />
      </div>

      <Input
        label="Accent Color"
        type="color"
        className="h-10 cursor-pointer p-1"
        {...register('color')}
      />

      <div className="flex justify-end gap-3 pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
