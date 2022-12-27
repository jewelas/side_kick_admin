import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Container, Button, Tooltip, TextField } from '@material-ui/core';

import illustration1 from '../../../assets/images/illustrations/pack1/authentication.svg';

export default function LivePreviewExample() {
  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
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
                          <div className="text-black mt-3">
                            <span className="text-center">
                              <h1 className="display-4 mb-1 font-weight-bold">
                                Login to your account
                              </h1>
                              <p className="font-size-lg mb-0 text-black-50">
                                We're glad you're working on your app. Login
                                below to continue.
                              </p>
                            </span>
                            <div className="bg-secondary rounded p-4 my-4">
                              <div className="text-black-50 text-center mb-3">
                                Sign in with
                              </div>
                              <Grid container spacing={6}>
                                <Grid item md={6}>
                                  <Tooltip title="Facebook" arrow>
                                    <Button
                                      fullWidth
                                      className="btn-facebook btn-animated-icon">
                                      <span className="btn-wrapper--icon d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon
                                          icon={['fab', 'facebook']}
                                        />
                                      </span>
                                    </Button>
                                  </Tooltip>
                                </Grid>
                                <Grid item md={6}>
                                  <Tooltip title="Twitter" arrow>
                                    <Button
                                      fullWidth
                                      className="btn-twitter btn-animated-icon">
                                      <span className="btn-wrapper--icon d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon
                                          icon={['fab', 'twitter']}
                                        />
                                      </span>
                                    </Button>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </div>
                            <div>
                              <div className="mb-3">
                                <label className="font-weight-bold mb-2">
                                  Email address
                                </label>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  placeholder="yourname@yourmail.com"
                                  type="email"
                                />
                              </div>
                              <div className="mb-4">
                                <div className="d-flex justify-content-between">
                                  <label className="font-weight-bold mb-2">
                                    Password
                                  </label>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}>
                                    Forgot password?
                                  </a>
                                </div>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  placeholder="Enter your password"
                                  type="password"
                                />
                              </div>

                              <Button
                                size="large"
                                fullWidth
                                className="text-uppercase font-weight-bold font-size-sm btn-primary">
                                Sign in
                              </Button>
                            </div>
                            <div className="text-center pt-4 text-black-50">
                              Don't have an account?{' '}
                              <a href="#/" onClick={(e) => e.preventDefault()}>
                                Create an Account
                              </a>
                            </div>
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
  );
}
