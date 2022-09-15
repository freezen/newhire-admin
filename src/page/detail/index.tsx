import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { reqConfig } from '../../utils/request';

export const Detail = () => {
    const [users, setUsers] = useState([])

    useEffect(()=>{
        
    }, [])

    return (
        <div className='adminContainer'>
            {users}
        </div>
    )
}