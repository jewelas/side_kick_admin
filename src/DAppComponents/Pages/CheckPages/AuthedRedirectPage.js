import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { authPing } from '../../../Services/REST/authRestService';

export function AuthedRedirectPage({ children, to }) {

    const [isAuthed, setIsAuthed] = useState(null);

    useEffect(() => {
        authPing().then(() => {
            setIsAuthed(true);
        }, () => {
            setIsAuthed(false);
        })
    }, [])

    return isAuthed === null ? null : isAuthed ? <Redirect to={to} /> : children;
}