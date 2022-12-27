import { StoreProvider, createStore, action } from 'easy-peasy';
import React, { useState, useEffect } from 'react';

export function GlobalStateStore({ children }) {

    const model = {
        loading: {
            isLoading: false,
            setIsLoading: action((state, isLoading) => {
                state.isLoading = isLoading;
            })
        }
    }

    const store = createStore(model, {
        name: 'AdminStore'
    });

    return (
        <StoreProvider store={store}>
            {children}
        </StoreProvider>
    )
}