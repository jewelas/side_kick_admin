import { useStoreState } from 'easy-peasy';
import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

export function LoadingScreen() {

    const isLoading = useStoreState(state => state.loading.isLoading)

    console.log("isLoading", isLoading)

    return (
        <div id={"sidekick-loading-screen"} className={isLoading ? "active" : ""}>
            <ScaleLoader
                height='15rem'
                width='1rem'
                radius='1rem'
                color='#49e287'
            />
        </div>
    )
}