import { useDeleteUser, useGetUserById, useUpdateUser } from '@/api/queries/userQueries';

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { UpdateUserDto } from '@shared/dto';
import { Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/Button/Button';
import Loader from '@/components/ui/Loader/Loader';

import ErrorPage from '../Error';
import UserUpdate from './components/UserUpdate';

export default function User() {
    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams();

    if (!id) return <ErrorPage statusCode={404} message="User not found" />;

    const { data: user, isLoading } = useGetUserById(id);
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: deleteUser } = useDeleteUser();

    const handleUpdateUser = (user: UpdateUserDto) => {
        updateUser({ userId: id, user });
        setIsOpen(false);
    };

    if (isLoading) return <Loader />;

    if (!user) return <ErrorPage statusCode={404} message="User not found" />;

    return (
        <div>
            <h1>{user?.email}</h1>
            <UserUpdate
                user={user}
                onSubmit={handleUpdateUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="flex gap-2">
                <Button variant="primary" onClick={() => setIsOpen(true)}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="primary" onClick={() => deleteUser(id)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
