import { Button, IconButton, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStoreActions } from 'easy-peasy';
import React, { useState, useEffect } from 'react';
import { getAllAdData } from '../../../Services/adManagementService';
import AdManagementLeftDrawer from './AdManagementLeftDrawer';
import AdManagementAccount from './AdManagementAccount';
import AdManagementCampaign from './AdManagementCampaign';
import AdManagementAd from './AdManagementAd';

export default function AdManagementPage() {

    const setIsLoading = useStoreActions(actions => actions.loading.setIsLoading);

    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [rightDrawerContent, setRightDrawerContent] = useState(null);
    const openDrawerWithContent = content => {

        setRightDrawerContent(content);
        setRightDrawerOpen(true);
    }

    const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);

    const [lastDataPull, setLastDataPull] = useState(new Date());

    const [mode, setMode] = useState("account");
    useEffect(() => {
        setIsLoading(true);

        getAllAdData().then(adTreeResult => {
            setAdTree(adTreeResult);
            setRightDrawerOpen(false);

            console.log("AD TREE", adTreeResult);

            setIsLoading(false);
        }, () => { setIsLoading(false) })
            .catch(() => { setIsLoading(false) });

    }, [mode, lastDataPull])
    const leftDrawerSetMode = newMode => {
        setActiveAccountId(null);
        setActiveCampaignId(null);
        setMode(newMode);
    }

    const [adTree, setAdTree] = useState({});

    const [activeAccountId, setActiveAccountId] = useState(null);
    const selectAccountCampaigns = accountId => {
        setActiveAccountId(accountId);
        setActiveCampaignId(null);
        setMode("campaign");
    }

    const [activeCampaignId, setActiveCampaignId] = useState(null);
    const selectAccountAds = accountId => {
        setActiveAccountId(accountId);
        setActiveCampaignId(null);
        setMode("ad");
    }
    const selectCampaignAds = campaignId => {
        setActiveAccountId(null);
        setActiveCampaignId(campaignId);
        setMode("ad");
    }

    let contentView = null;
    switch (mode) {
        case "account":
            contentView = (
                <AdManagementAccount
                    isActive={mode === "account"}
                    accounts={adTree.accounts}
                    openDrawerWithContent={openDrawerWithContent}
                    setLastDataPull={setLastDataPull}
                    selectAccountCampaigns={selectAccountCampaigns}
                    selectAccountAds={selectAccountAds}
                    leftDrawerSetMode={leftDrawerSetMode}
                />
            )
            break;
        case "campaign":
            contentView = (
                <AdManagementCampaign
                    isActive={mode === "campaign"}
                    accounts={adTree.accounts}
                    propAccountId={activeAccountId}
                    openDrawerWithContent={openDrawerWithContent}
                    setLastDataPull={setLastDataPull}
                    selectCampaignAds={selectCampaignAds}
                    leftDrawerSetMode={leftDrawerSetMode}
                />
            )
            break;
        case "ad":
            contentView = (
                <AdManagementAd
                    isActive={mode === "ad"}
                    accounts={adTree.accounts}
                    propAccountId={activeAccountId}
                    propCampaignId={activeCampaignId}
                    openDrawerWithContent={openDrawerWithContent}
                    setLastDataPull={setLastDataPull}
                    leftDrawerSetMode={leftDrawerSetMode}
                />
            )
            break;
    }

    const modeNameMap = {
        "account": "accounts",
        "campaign": "campaigns",
        "ad": "ad content"
    }

    return (
        <div className={"ad-management-page-outer"}>
            <AdManagementLeftDrawer
                leftDrawerOpen={leftDrawerOpen}
                setLeftDrawerOpen={setLeftDrawerOpen}
                mode={mode}
                leftDrawerSetMode={leftDrawerSetMode}
            />
            <div className="fixedHeader">
                <span className="headerTitle">{modeNameMap[mode] ?? ""}</span>
            </div>
            <div className={`content-body ${leftDrawerOpen ? "drawer-open" : "drawer-closed"}`}>
                {contentView}
            </div>
            <Drawer
                anchor={'right'}
                open={rightDrawerOpen}
                onClose={setRightDrawerOpen.bind(null, false)}
            >
                {rightDrawerContent}
            </Drawer>
        </div>
    )
}