import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { Button, Grid, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStoreActions } from 'easy-peasy';
import { deleteAd } from '../../../Services/REST/adManagementRestService';
import AdAdForm from './AdAdForm';
import AdFilePreviewModal from './AdFilePreviewModal';

export default function AdManagementAd({ isActive, accounts, propAccountId, propCampaignId, openDrawerWithContent, setLastDataPull, leftDrawerSetMode }) {

    const campaigns = (!accounts ? null : propAccountId ? Object.values(accounts[propAccountId].campaigns) :
        Object.values(accounts).map(x => Object.values(x.campaigns)).reduce((r, e) => r.concat(e), []))
        ?.reduce((r, e) => { r[e.docId] = e; return r; }, {})

    const ads = !accounts || !campaigns ? null : propAccountId ? Object.values(accounts[propAccountId].ads) :
        propCampaignId ? Object.values(campaigns[propCampaignId].ads) :
            Object.values(campaigns).map(x => Object.values(x.ads)).reduce((r, e) => r.concat(e), []);

    const campaignOptions = !campaigns ? [] : Object.values(campaigns).map(x => ({ value: x.docId, text: x.name }));

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [activeAdId, setActiveAdId] = useState(null);
    const activeAd = ads ? ads.filter(x => x.docId === activeAdId)[0] : null;

    const [selectedIds, setSelectedIds] = useState([]);

    const handleRowClick = (params) => {
        setActiveAdId(params.id);
        console.log(activeAd);
    }

    const handleCellClick = (cellData, event) => {

    }

    const handleSelectionModelChange = idList => {
        setSelectedIds(idList);
    }

    const handleNewClick = () => {
        openDrawerWithContent(<AdAdForm baseData={null} campaignOptions={campaignOptions} propCampaignId={propCampaignId} setLastDataPull={setLastDataPull} />)
    }

    const handleEditClick = (params) => {
        openDrawerWithContent(<AdAdForm baseData={params.row} campaignOptions={campaignOptions} propCampaignId={propCampaignId} setLastDataPull={setLastDataPull} />);
    }

    const handleDeleteClick = params => {
        setIsLoading(true);
        deleteAd(params.row.docId).then(() => {
            setLastDataPull(new Date());
        })
    }

    const handleBulkDeleteClick = () => {
        let deletedCount = 0;
        let needToDeleteCount = selectedIds.length;
        if (needToDeleteCount === 0) {
            return;
        }

        setIsLoading(true);
        let finalize = () => {
            if (deletedCount === needToDeleteCount) {
                setLastDataPull(new Date());
            }
        }

        selectedIds.forEach(docId => {
            deleteAd(docId).then(() => {
                deletedCount++;
                finalize()
            })
        })
    }

    const columns = [
        { field: 'docId', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'campaignName', headerName: 'Campaign', width: 200 },
        { field: 'accountName', headerName: 'Account', width: 200 },
        { field: 'enabled', headerName: 'Active', width: 200, type: 'boolean' },
        {
            field: "edit",
            headerName: "Edit",
            sortable: false,
            renderCell: (params) => {
                const editClick = (e) => {
                    e.stopPropagation();
                    handleEditClick(params);
                };

                return <Button className={"edit-button"} onClick={editClick}><FontAwesomeIcon icon={['far', 'edit']} className={"text-white"} /></Button>;
            }
        },
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            renderCell: (params) => {
                const deleteClick = (e) => {
                    e.stopPropagation();
                    handleDeleteClick(params);
                };

                return <Button className={"edit-button"} onClick={deleteClick}><FontAwesomeIcon icon={['far', 'trash-alt']} className="text-white" /></Button>;
            }
        }
    ];

    const CustomToolbar = () => {

        return (
            <GridToolbarContainer className="mb-2">
                <Button className="font-weight-bold text-first btn-second mr-2 text-uppercase" onClick={handleNewClick}>
                    <FontAwesomeIcon icon={['far', 'plus-square']} className="mr-1" />
                    {"New"}
                </Button>
                <Button className="font-weight-bold text-first btn-second mr-2 text-uppercase" onClick={handleBulkDeleteClick} disabled={selectedIds.length === 0}>
                    <FontAwesomeIcon icon={['far', 'trash-alt']} className="mr-1" />
                    {"Delete"}
                </Button>
                <div className="mx-2">
                    {propAccountId ? "Filtering on account " + accounts[propAccountId].companyName : propCampaignId ? "Filtering on campaign " + campaigns[propCampaignId].name : ""}
                </div>
                {propAccountId || propCampaignId ? <Button onClick={leftDrawerSetMode.bind(null, "ad")} className="font-weight-bold text-first btn-second text-uppercase ml-1">Clear Filter</Button> : null}
            </GridToolbarContainer>
        )
    }

    const [pageSize, setPageSize] = React.useState(10);

    const targetNameMap = {
        "br": "Bottom-Right",
        "toaster": "Toaster"
    }

    return (
        <div className={`ad-management-content-pane ${activeAd ? "ads" : "no-account"}`}>
            <div className={"stats-container ads"}>
                <Grid container >
                    <Grid item xs={12} className="pb-0">
                        <h2 className={`${activeAd?.name ? "text-left mb-3" : "text-center mb-0"} text-white `}>{activeAd?.name ?? "Select an ad."}</h2>
                    </Grid>
                    {!activeAd ? null : (<>
                        <Grid item xs={3}>
                            <TextField
                                label="Account"
                                value={activeAd?.accountName}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Campaign"
                                value={activeAd?.campaignName}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Disabled"
                                value={activeAd?.disabled}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Weight"
                                value={activeAd?.weight}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Impressions"
                                value={activeAd?.impressions}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Clicks"
                                value={activeAd?.clicks}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Time on Screen (Active)"
                                value={activeAd?.timeOnScreenActive + " seconds"}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Time on Screen (Total)"
                                value={activeAd?.timeOnScreenInactive + " seconds"}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Mouse Over Count"
                                value={activeAd?.mouseOverCount}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Target"
                                value={targetNameMap[activeAd?.target] ?? ""}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="URL"
                                value={activeAd?.url}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <AdFilePreviewModal name={activeAd?.name} fileLink={activeAd?.fileLink} />
                        </Grid>
                        {activeAd?.target !== "toaster" ? null :
                            <>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Button Text"
                                        value={activeAd?.buttonText}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Description Text"
                                        value={activeAd?.descriptionText}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        }
                    </>)}
                </Grid>
            </div>
            <div className={"table-outer ads"}>
                <div className={"dgrid-container"}>
                    <DataGrid
                        className={"dgrid-outer"}
                        rows={Object.values(ads ?? {})}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        onRowClick={handleRowClick}
                        onCellClick={handleCellClick}
                        onSelectionModelChange={handleSelectionModelChange}
                        density="compact"
                        disableColumnMenu
                        disableSelectionOnClick
                        checkboxSelection
                        components={{
                            Toolbar: CustomToolbar
                        }}
                    />
                </div>
            </div>
        </div>
    )
}