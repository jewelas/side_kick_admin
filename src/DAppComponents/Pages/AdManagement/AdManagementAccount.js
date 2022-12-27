import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { Button, Grid, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdAccountForm from './AdAccountForm';
import { useStoreActions } from 'easy-peasy';
import { deleteAccount } from '../../../Services/REST/adManagementRestService';

export default function AdManagementAccount({ isActive, accounts, openDrawerWithContent, setLastDataPull, selectAccountCampaigns, selectAccountAds }) {

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [activeAccountId, setActiveAccountId] = useState(null);
    const activeAccount = accounts ? accounts[activeAccountId] : null;

    const [selectedIds, setSelectedIds] = useState([]);

    const handleCampaignDrill = (accountId, event) => {
        event?.stopPropagation();

        selectAccountCampaigns(accountId)
    }

    const handleAdDrill = (accountId, event) => {
        event?.stopPropagation();
        selectAccountAds(accountId);
    }

    const handleRowClick = (params) => {
        setActiveAccountId(params.id);
    }

    const handleCellClick = (cellData, event) => {
        if (cellData.field === "campaignCount") {
            handleCampaignDrill(cellData.id, event);
        } else if (cellData.field === "adCount") {
            handleAdDrill(cellData.id, event);
        }
    }

    const handleSelectionModelChange = idList => {
        setSelectedIds(idList);
    }

    const handleNewClick = () => {
        openDrawerWithContent(<AdAccountForm baseData={null} setLastDataPull={setLastDataPull} />);
    }

    const handleEditClick = (params) => {
        openDrawerWithContent(<AdAccountForm baseData={params.row} setLastDataPull={setLastDataPull} />);
    }

    const handleDeleteClick = params => {
        setIsLoading(true);
        deleteAccount(params.row.docId).then(() => {
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
            deleteAccount(docId).then(() => {
                deletedCount++;
                finalize()
            })
        })
    }

    const columns = [
        { field: 'docId', headerName: 'ID', width: 200 },
        { field: 'companyName', headerName: 'Company', width: 200 },
        { field: 'enabled', headerName: 'Active', width: 200, type: 'boolean' },
        { field: 'campaignCount', headerName: 'Campaigns', width: 150, type: 'number' },
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

                return <Button className={"edit-button"} onClick={editClick}><FontAwesomeIcon icon={['far', 'edit']} className="text-white" /></Button>;
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
            </GridToolbarContainer>
        )
    }

    const [pageSize, setPageSize] = React.useState(10);

    return (
        <div className={`ad-management-content-pane ${activeAccount ? "" : "no-account"}`}>
            <div className={"stats-container"}>
                <Grid container >
                    <Grid item xs={12} className="pb-0">
                        <h2 className={`${activeAccount?.companyName ? "text-left mb-3" : "text-center mb-0"} text-white `}>{activeAccount?.companyName ?? "Select an account."}</h2>
                    </Grid>
                    {!activeAccount ? null : (<>
                        <Grid item xs={3}>
                            <TextField
                                label="Email"
                                value={activeAccount?.email}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Phone"
                                value={activeAccount?.phone}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Wallet Address"
                                value={activeAccount?.walletAddress}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Weight"
                                value={activeAccount?.weight}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Disabled"
                                value={activeAccount?.disabled}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Campaigns"
                                value={activeAccount?.campaignCount}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Ads"
                                value={activeAccount?.adCount}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                type={"number"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Notes"
                                value={activeAccount?.notes}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                                multiline
                                fullWidth
                            />
                        </Grid>
                    </>)}
                </Grid>
            </div>
            <div className={"table-outer"}>
                <div className={"dgrid-container"}>
                    <DataGrid
                        className={"dgrid-outer"}
                        rows={Object.values(accounts ?? {})}
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
        </div >
    )
}