import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { adminPing } from '../../../Services/REST/authRestService';

export function AdminPage({ children }) {

    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        adminPing().then(() => {
            setIsAdmin(true);
        }, () => {
            setIsAdmin(false);
        })
    }, [])

    return isAdmin === null ? null : isAdmin ? children : <Redirect to={"/Login"} />
}