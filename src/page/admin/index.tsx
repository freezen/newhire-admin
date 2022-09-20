import React, { useEffect, useState } from 'react';
import { get } from '../../utils/request';

export const Admin = () => {
    const [users, setUsers] = useState([])

    async function getUsers() {
        try {
            const res = await get('/admin')
            const data = res?.data ?? [];
            console.log('res:', data)
            const r = [] as any
            data.forEach((item: any) => {
                r.push(
                    <div>
                        <span>{item.name}</span>
                        <span>{item.auth}</span>
                    </div>
                )
            })
            setUsers(r)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        getUsers()
    }, [])

    return (
        <div className='adminContainer' />
    )
}