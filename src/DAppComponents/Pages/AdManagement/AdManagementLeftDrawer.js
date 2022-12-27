import React, { useState, useEffect } from 'react';
import { Button, IconButton, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import skLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_green.png';

export default function AdManagementLeftDrawer({ leftDrawerOpen, setLeftDrawerOpen, mode, leftDrawerSetMode }) {

    const toggleLeftDrawerOpen = () => {
        setLeftDrawerOpen(() => !leftDrawerOpen);
    }

    const logout = () => {
        localStorage.removeItem("accessToken");
        window.location = "/Login";
    }

    return (
        <Drawer className={`left-side-drawer ${leftDrawerOpen ? "open" : "closed"}`} variant="permanent" open={leftDrawerOpen}>
            <div className="sidebar-header align-items-center font-weight-bold d-flex justify-content-between text-white mt-2">
                <span className={`ml-4 pl-1 mt-2 ${leftDrawerOpen ? "" : "hide"}`}  >
                    <img title="SK Logo" src={skLogo} className="skLogo mr-1" />
                    SIDEKICK Admin Portal
                </span>
                <IconButton className={"open-close-icon"} onClick={toggleLeftDrawerOpen}>
                    {leftDrawerOpen ? <FontAwesomeIcon icon={['fas', 'times']} /> : <FontAwesomeIcon icon={['fas', 'caret-right']} />}
                </IconButton>
            </div>
            <List className={"left-drawer-list"}>
                <ListItem button key={"ad-left-account"} className={`left-drawer-list-item ${mode === "account" ? "active" : ""}`} onClick={leftDrawerSetMode.bind(null, "account")}>
                    <ListItemIcon className={"left-drawer-list-item-icon"}>
                        <FontAwesomeIcon icon={['fas', 'folder-open']} title="Accounts" />
                    </ListItemIcon>
                    <ListItemText primary={"Accounts"} className={`left-drawer-list-item-text ${leftDrawerOpen ? "" : "hide"}`} />
                </ListItem>
                <ListItem button key={"ad-left-campaign"} className={`left-drawer-list-item ${mode === "campaign" ? "active" : ""}`} onClick={leftDrawerSetMode.bind(null, "campaign")}>
                    <ListItemIcon className={"left-drawer-list-item-icon"}>
                        <FontAwesomeIcon icon={['fas', 'copy']} title="Campaigns" />
                    </ListItemIcon>
                    <ListItemText primary={"Campaigns"} className={`left-drawer-list-item-text ${leftDrawerOpen ? "" : "hide"}`} />
                </ListItem>
                <ListItem button key={"ad-left-ad"} className={`left-drawer-list-item ${mode === "ad" ? "active" : ""}`} onClick={leftDrawerSetMode.bind(null, "ad")}>
                    <ListItemIcon className={"left-drawer-list-item-icon"}>
                        <FontAwesomeIcon icon={['fas', 'images']} title="Ad Content" />
                    </ListItemIcon>
                    <ListItemText primary={"Ad Content"} className={`left-drawer-list-item-text ${leftDrawerOpen ? "" : "hide"}`} />
                </ListItem>
                <Divider />
                <ListItem button key={"ad-left-logout"} className={`left-drawer-list-item`} onClick={logout}>
                    <ListItemIcon className={"left-drawer-list-item-icon"}>
                        <FontAwesomeIcon icon={['fas', 'sign-out-alt']} title="Logout" />
                    </ListItemIcon>
                    <ListItemText primary={"Logout"} className={`left-drawer-list-item-text ${leftDrawerOpen ? "" : "hide"}`} />
                </ListItem>
            </List>
        </Drawer>
    );
}