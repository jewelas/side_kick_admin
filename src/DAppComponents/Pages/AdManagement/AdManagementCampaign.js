import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { Button, Grid, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStoreActions } from 'easy-peasy';
import AdCampaignForm from './AdCampaignForm';
import { deleteCampaign } from '../../../Services/REST/adManagementRestService';

export default function AdManagementCampaign({ isActive, accounts, propAccountId, openDrawerWithContent, setLastDataPull, selectCampaignAds, leftDrawerSetMode }) {
    const campaigns = !accounts ? null : propAccountId ? Object.values(accounts[propAccountId].campaigns) :
        Object.values(accounts).map(x => Object.values(x.campaigns)).reduce((r, e) => r.concat(e), []);

    const accountOptions = !accounts ? [] : Object.values(accounts).map(x => ({ value: x.docId, text: x.companyName }));

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [activeCampaignId, setActiveCampaignId] = useState(null);
    const activeCampaign = campaigns ? campaigns.filter(x => x.docId === activeCampaignId)[0] : null;

    const [selectedIds, setSelectedIds] = useState([]);

    const handleAdDrill = (campaignId, event) => {
        event?.stopPropagation();
        selectCampaignAds(campaignId);
    }

    const handleRowClick = (params) => {
        setActiveCampaignId(params.id);
        console.log(activeCampaign)
    }

    const handleCellClick = (cellData, event) => {
        if (cellData.field === "adCount") {
            handleAdDrill(cellData.id, event);
        }
    }

    const handleSelectionModelChange = idList => {
        setSelectedIds(idList);
    }

    const handleNewClick = () => {
        openDrawerWithContent(<AdCampaignForm baseData={null} accountOptions={accountOptions} propAccountId={propAccountId} setLastDataPull={setLastDataPull} />)
    }

    const handleEditClick = (params) => {
        openDrawerWithContent(<AdCampaignForm baseData={params.row} accountOptions={accountOptions} propAccountId={propAccountId} setLastDataPull={setLastDataPull} />);
    }

    const handleDeleteClick = params => {
        setIsLoading(true);
        deleteCampaign(params.row.docId).then(() => {
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
            deleteCampaign(docId).then(() => {
                deletedCount++;
                finalize()
            })
        })
    }

    const columns = [
        { field: 'docId', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'accountName', headerName: 'Account', width: 200 },
        { field: 'enabled', headerName: 'Active', width: 200, type: 'boolean' },
        { field: 'adCount', headerName: 'Ads', width: 150, type: 'number' },
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
                    {propAccountId ? "Filtering on account " + accounts[propAccountId].companyName : ""}
                </div>
                {propAccountId ? <Button onClick={leftDrawerSetMode.bind(null, "campaign")} className="font-weight-bold text-first btn-second text-uppercase ml-1">Clear Filter</Button> : null}
            </GridToolbarContainer>
        )
    }

    const [pageSize, setPageSize] = React.useState(10);

    return (
        <div className={`ad-management-content-pane ${activeCampaign ? "camps" : "no-account"}`}>
            <div className={"stats-container camps"}>
                <Grid container >
                    <Grid item xs={12} className="pb-0">
                        <h2 className={`${activeCampaign?.name ? "text-left mb-3" : "text-center mb-0"} text-white `}>{activeCampaign?.name ?? "Select a campaign."}</h2>
                    </Grid>
                    {!activeCampaign ? null : (<>
                        <Grid item xs={3}>
                            <TextField
                                label="Account"
                                value={activeCampaign?.accountName}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Ads"
                                value={activeCampaign?.adCount}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Disabled"
                                value={activeCampaign?.disabled}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Start Date"
                                value={activeCampaign?.startDate}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="End Date"
                                value={activeCampaign?.endDate}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Click Cap"
                                value={activeCampaign?.clickCap}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Impression Cap"
                                value={activeCampaign?.impressionCap}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Weight"
                                value={activeCampaign?.weight}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                    </>)}
                </Grid>
            </div>
            <div className={"table-outer camps"}>
                <div className={"dgrid-container"}>
                    <DataGrid
                        className={"dgrid-outer"}
                        rows={Object.values(campaigns ?? {})}
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