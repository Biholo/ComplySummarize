import { useGetAllUsers } from '@/api/queries/userQueries';

import { useState } from 'react';

import Loader from '@/components/ui/Loader/Loader';

export default function Users() {
    const [limit, setLimit] = useState<string>('10');
    const [page, setPage] = useState<string>('1');
    const [search, setSearch] = useState<string>('');
    const { data: users, isLoading } = useGetAllUsers({ limit, page, search });

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1>Users</h1>
            <div className="flex flex-col gap-4">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
                <input type="number" value={page} onChange={(e) => setPage(e.target.value)} />
            </div>
            <div className="flex flex-col gap-4">
                {users?.map((user) => (
                    <div key={user.id}>
                        <p>{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
