import { Box, FormControlLabel, TextField, Switch, Button, Divider, Grid, Checkbox } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useStoreActions } from 'easy-peasy';
import { createAccount, getAccount, updateAccount } from '../../../Services/REST/adManagementRestService';

export default function AdAccountForm({ baseData, setLastDataPull }) {

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [accountFormData, setAccountFormData] = useState({
        "phone": baseData?.phone ?? "",
        "walletAddress": baseData?.walletAddress ?? "",
        "weight": baseData?.weight ?? 1,
        "notes": baseData?.notes ?? "",
        "email": baseData?.email ?? "",
        "companyName": baseData?.companyName ?? "",
        "disabled": baseData?.disabled ?? true,
        "docId": baseData?.docId ?? null
    });

    const canSubmit = (accountFormData?.companyName ?? "") !== "";

    const editAccountFormData = (key, event) => {
        let value = event.target.value;

        let formData = { ...accountFormData };

        if (key === "weight" && value !== "") {
            value = parseInt(value);
        }

        if (key === "disabled") {
            value = event.target.checked
        }

        formData[key] = value;

        setAccountFormData(formData);
    }

    const handleSave = () => {

        if (!canSubmit) {
            return;
        }

        setIsLoading(true);

        if (accountFormData.docId) {

            updateAccount(accountFormData).then(({ docId }) => {
                setLastDataPull(new Date())
            });

        } else {
            createAccount(accountFormData.companyName).then(({ docId }) => {
                setAccountFormData({ ...accountFormData, docId })
                updateAccount({ ...accountFormData, docId }).then(() => {
                    setLastDataPull(new Date());
                })
            })
        }
    }

    return (
        <Box
            className={"ad-management-form-container"}
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <Grid>
                <h2 className={"text-center text-white mb-3"}>{accountFormData.docId ? "Edit Account" : "New Account"}</h2>
            </Grid>
            <Grid container spacing={3} className="mt-0">
                <Grid item xs={12}>
                    <TextField
                        required
                        label="Company Name"
                        value={accountFormData.companyName}
                        onChange={editAccountFormData.bind(null, "companyName")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} className="pl-3 mt-3">
                    <FormControlLabel control={<Checkbox
                        checked={accountFormData.disabled}
                        onChange={editAccountFormData.bind(null, "disabled")}
                    />} label="Disabled"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Email"
                        value={accountFormData.email}
                        onChange={editAccountFormData.bind(null, "email")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Phone"
                        value={accountFormData.phone}
                        onChange={editAccountFormData.bind(null, "phone")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Wallet Address"
                        value={accountFormData.walletAddress}
                        onChange={editAccountFormData.bind(null, "walletAddress")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="outlined-number"
                        label="Weight"
                        type="number"
                        value={accountFormData.weight}
                        onChange={editAccountFormData.bind(null, "weight")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Notes"
                        value={accountFormData.notes}
                        onChange={editAccountFormData.bind(null, "notes")}
                        multiline
                        fullWidth
                    />
                </Grid>
                <Divider />
                <Grid item xs={12} className="text-right mt-2">
                    <Button
                        className="font-weight-bold text-first btn-second mr-2 text-uppercase"
                        onClick={handleSave}
                        disabled={!canSubmit}
                    >
                        {"Save"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}