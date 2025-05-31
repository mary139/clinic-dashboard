export type StaffStatus = 'Active' | 'On Leave';

export interface Staff {
    id: string;
    fullName: string;
    position: string;
    status: StaffStatus;
    hireDate: string;
}

