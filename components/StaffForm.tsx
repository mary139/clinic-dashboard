'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

type Staff = {
    id: number;
    fullName: string;
    position: string;
    status: string;
    hireDate: string;
};

type StaffFormProps = {
    onSubmit: (staff: Partial<Staff>) => void;
    initialData?: Partial<Staff>;
    loading?: boolean;
};

const staffValidationSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    position: z.string().min(1, 'Position is required'),
    status: z.string().min(1, 'Status is required'),
    hireDate: z.string().min(1, 'Hire date is required'),
});

export default function StaffForm({ onSubmit, initialData = {}, loading = false }: StaffFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Partial<Staff>>({
        resolver: zodResolver(staffValidationSchema),
        defaultValues: initialData,
    });

    useEffect(() => {
        if (initialData) {
            setValue('fullName', initialData.fullName || '');
            setValue('position', initialData.position || '');
            setValue('status', initialData.status || '');
            setValue('hireDate', initialData.hireDate || '');
        }
    }, [initialData, setValue]);

    const submitHandler = (data: Partial<Staff>) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                    {...register('fullName')}
                    required
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <input
                    {...register('position')}
                    required
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                    {...register('status')}
                    required
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hire Date</label>
                <input
                    type="date"
                    {...register('hireDate')}
                    required
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.hireDate && <p className="text-red-500 text-sm">{errors.hireDate.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="text-sm text-gray-900 border border-gray-900 rounded-md bg-gray-50 dark:bg-gray-200 dark:border-gray-100 dark:text-gray-900 font-bold py-2 px-4 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}
