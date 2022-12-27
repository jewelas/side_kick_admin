import { Box, FormControlLabel, TextField, Checkbox, Input, Button, Divider, Grid, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useStoreActions } from 'easy-peasy';
import { createAd, deleteAd, updateAd } from '../../../Services/REST/adManagementRestService';

export default function AdAdForm({ baseData, campaignOptions, propCampaignId, setLastDataPull }) {

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [adFormData, setAdFormData] = useState({
        "campaignId": baseData?.campaignId ?? propCampaignId ?? "",
        "name": baseData?.name ?? "",
        "disabled": baseData?.disabled ?? true,
        "weight": baseData?.weight ?? 1,
        "target": baseData?.target ?? "br",
        "buttonText": baseData?.buttonText ?? "",
        "descriptionText": baseData?.descriptionText ?? "",
        "url": baseData?.url ?? "",
        "fileLink": baseData?.fileLink ?? "",
        "docId": baseData?.docId ?? null
    });

    const canSubmit = (adFormData?.name ?? "") !== "" && (adFormData?.campaignId ?? "") !== "";

    const editAdFormData = (key, event) => {
        let value = event.target.value;

        let formData = { ...adFormData };

        if ((key === "weight") && value !== "") {
            value = parseInt(value);
        }

        if (key === "disabled") {
            value = event.target.checked
        }

        formData[key] = value;

        setAdFormData(formData);
        console.log("AD FORM", adFormData)
    }

    const handleEditFile = (event) => {

        const file = event?.target?.files[0] ?? null;
        if (file) {
            console.log("FILE", file);

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {

                setAdFormData({ ...adFormData, fileLink: reader.result });
            }
            reader.onerror = (error) => {
                console.log('Error: ', error);
            };
        }
    }

    const handleSave = () => {

        if (!canSubmit) {
            return;
        }

        setIsLoading(true);

        if (adFormData.docId) {

            updateAd(adFormData).then(({ docId }) => {
                setLastDataPull(new Date())
            });

        } else {
            createAd(adFormData.name, adFormData.campaignId).then(({ docId }) => {
                setAdFormData({ ...adFormData, docId })
                updateAd({ ...adFormData, docId }).then(() => {
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
                <h2 className={"text-center text-white mb-3"}>{adFormData.docId ? "Edit Ad" : "New Ad"}</h2>
            </Grid>
            <Grid container spacing={3} className="mt-0">
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="ad-form-campaign-id-select-label">{"Campaign"}</InputLabel>
                        <Select
                            required
                            labelId="ad-form-campaign-id-select-label"
                            value={adFormData.campaignId}
                            label="Campaign"
                            onChange={editAdFormData.bind(null, "campaignId")}
                        >
                            {campaignOptions.map(x => <MenuItem key={`ad-campaign-option-${x.value}`} value={x.value}>{x.text}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        label="Ad Name"
                        value={adFormData.name}
                        onChange={editAdFormData.bind(null, "name")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} className="pl-3 mt-3">
                    <FormControlLabel control={<Checkbox
                        checked={adFormData.disabled}
                        onChange={editAdFormData.bind(null, "disabled")}
                    />} label="Disabled"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="outlined-number"
                        label="Weight"
                        type="number"
                        value={adFormData.weight}
                        onChange={editAdFormData.bind(null, "weight")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="ad-form-target-select-label">{"Target"}</InputLabel>
                        <Select
                            required
                            labelId="ad-form-target-select-label"
                            value={adFormData.target}
                            label="Target"
                            onChange={editAdFormData.bind(null, "target")}
                        >
                            <MenuItem key={`ad-target-option-br`} value={"br"}>{"Bottom-Right"}</MenuItem>
                            <MenuItem key={`ad-target-option-toaster`} value={"toaster"}>{"Toaster"}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {adFormData.target !== "toaster" ? null :
                    <>
                        <Grid item xs={6}>
                            <TextField
                                required
                                label="Button Text"
                                value={adFormData.buttonText}
                                onChange={editAdFormData.bind(null, "buttonText")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description Text"
                                value={adFormData.descriptionText}
                                onChange={editAdFormData.bind(null, "descriptionText")}
                                fullWidth
                            />
                        </Grid>
                    </>
                }
                <Grid item xs={12}>
                    <TextField
                        label="URL"
                        value={adFormData.url}
                        onChange={editAdFormData.bind(null, "url")}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className="mt-2">
                        File Link
                    </InputLabel>
                    <FormControl fullWidth>
                        <Input
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            onChange={handleEditFile}
                            fullwidth
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <img className={"image-preview"} src={adFormData.fileLink} />
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