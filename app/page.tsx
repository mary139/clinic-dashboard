import StaffManagement from '@/components/StaffManagement';
import Link from 'next/link';
import { Add } from 'iconsax-reactjs';

export default function StaffPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clinic Staff Management</h1>
        <Link
          href="/staff/add"
          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <span className="hidden md:inline-block mr-2">Add Staff</span>
          <Add size={18} />
        </Link>
      </div>
      <StaffManagement />
    </div>
  );
}
