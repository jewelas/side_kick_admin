import { Box, FormControlLabel, TextField, Checkbox, Button, Divider, Grid, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useStoreActions } from 'easy-peasy';
import { createCampaign, updateCampaign, deleteCampaign } from '../../../Services/REST/adManagementRestService';

export default function AdCampaignForm({ baseData, accountOptions, propAccountId, setLastDataPull }) {

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [campaignFormData, setCampaignFormData] = useState({
        "name": baseData?.name ?? "",
        "impressionCap": baseData?.impressionCap ?? -1,
        "clickCap": baseData?.clickCap ?? -1,
        "startDate": baseData?.startDate ?? "",
        "endDate": baseData?.endDate ?? "",
        "weight": baseData?.weight ?? 1,
        "disabled": baseData?.disabled ?? true,
        "docId": baseData?.docId ?? null,
        "accountId": baseData?.accountId ?? propAccountId ?? "",
    });

    const canSubmit = (campaignFormData?.name ?? "") !== "" && (campaignFormData?.accountId ?? "") !== "";

    const editCampaignFormData = (key, event) => {
        let value = event.target.value;

        let formData = { ...campaignFormData };

        if ((key === "weight" || key === "impressionCap" || key === "clickCap") && value !== "") {
            value = parseInt(value);
        }

        if (key === "disabled") {
            value = event.target.checked
        }

        formData[key] = value;

        setCampaignFormData(formData);
        console.log("CAMPAIGN FORM", campaignFormData)
    }

    const handleSave = () => {

        if (!canSubmit) {
            return;
        }

        setIsLoading(true);

        if (campaignFormData.docId) {

            updateCampaign(campaignFormData).then(({ docId }) => {
                setLastDataPull(new Date())
            });

        } else {
            createCampaign(campaignFormData.name, campaignFormData.accountId).then(({ docId }) => {
                setCampaignFormData({ ...campaignFormData, docId })
                updateCampaign({ ...campaignFormData, docId }).then(() => {
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
                <h2 className={"text-center text-white mb-3"}>{campaignFormData.docId ? "Edit Campaign" : "New Campaign"}</h2>
            </Grid>
            <Grid container spacing={3} className="mt-0">
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="campaign-form-account-id-select-label">{"Account"}</InputLabel>
                        <Select
                            required
                            labelId="campaign-form-account-id-select-label"
                            value={campaignFormData.accountId}
                            label="Account"
                            onChange={editCampaignFormData.bind(null, "accountId")}
                        >
                            {accountOptions.map(x => <MenuItem key={`campaign-account-option-${x.value}`} value={x.value}>{x.text}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        label="Campaign Name"
                        value={campaignFormData.name}
                        onChange={editCampaignFormData.bind(null, "name")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} className="pl-3 mt-3">
                    <FormControlLabel control={<Checkbox
                        checked={campaignFormData.disabled}
                        onChange={editCampaignFormData.bind(null, "disabled")}
                    />} label="Disabled"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="outlined-number"
                        label="Weight"
                        type="number"
                        value={campaignFormData.weight}
                        onChange={editCampaignFormData.bind(null, "weight")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Start Date"
                        value={campaignFormData.startDate}
                        onChange={editCampaignFormData.bind(null, "startDate")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="End Date"
                        value={campaignFormData.endDate}
                        onChange={editCampaignFormData.bind(null, "endDate")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-number"
                        label="Click Cap"
                        type="number"
                        value={campaignFormData.clickCap}
                        onChange={editCampaignFormData.bind(null, "clickCap")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-number"
                        label="Impression Cap"
                        type="number"
                        value={campaignFormData.impressionCap}
                        onChange={editCampaignFormData.bind(null, "impressionCap")}
                        InputLabelProps={{
                            shrink: true,
                        }}
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
                        {"SAVE"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}