import { Grid, Container, Button } from '@material-ui/core';
import { useStoreActions } from 'easy-peasy';
import React, { useState, useEffect } from 'react';
import { processLogin } from '../../Services/authService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import illustration1 from '../../assets/images/sidekick/animation/Sidekick_transparent_large.gif';

export default function LoginPage() {

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const handleLogin = () => {

        setIsLoading(true);

        processLogin()
            .then(() => {
                setIsLoading(false);
                window.location.reload();
            }, () => {
                // handle other issues
                setIsLoading(false);
            })
            .catch(err => {
                // handle error
                setIsLoading(false);
                console.log(err);
            })
    }

    return (
        <>
            <div className="app-wrapper min-vh-100">
                <div className="app-main min-vh-100">
                    <div className="app-content p-0">
                        <div className="app-content--inner d-flex align-items-center">
                            <div className="flex-grow-1 w-100 d-flex align-items-center">
                                <div className="bg-composed-wrapper--content py-5">
                                    <Container>
                                        <Grid container spacing={6}>
                                            <Grid item lg={6} className="d-flex align-items-center">
                                                <div className="divider-v d-none d-lg-block divider-v-md" />
                                                <div className="w-100 pr-0 pr-lg-5">
                                                    <h2 className="display-3 font-weight-bold text-first text-center mb-3">
                                                        SideKick Admin
                                                    </h2>
                                                    <p className="font-size-xl text-first text-left mb-3">
                                                        Welcome to the SideKick Admin Portal. Click the button below to login with MetaMask.
                                                    </p>
                                                    <div className="text-center mt-5">
                                                        <Button
                                                            onClick={handleLogin}
                                                            size="large"
                                                            className="rounded-sm font-weight-bold shadow-black-lg btn-first">
                                                            <span className="btn-wrapper--label text-white font-weight-bold text-uppercase fontRubik">Login</span>
                                                            <span className="btn-wrapper--icon text-white btnLaunchIcon">
                                                                <FontAwesomeIcon icon={['fa', 'sign-in-alt']} className="font-size-xxl" style={{ fill: "#1d2b72" }} />
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                className="d-none d-lg-flex align-items-center">
                                                <img
                                                    alt="..."
                                                    className="w-100 mx-auto d-block img-fluid"
                                                    src={illustration1}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}