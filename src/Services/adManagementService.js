import { getAccounts, getAds, getCampaigns } from "./REST/adManagementRestService";

const createDataTree = (accountData, campaignData, adData) => {

    let result = {
        rawAccounts: accountData,
        rawCampagns: campaignData,
        rawAds: adData
    };

    result.accounts = accountData.reduce((r, account) => {
        if (!r[account.docId]) {
            r[account.docId] = { ...account, id: account.docId, enabled: !account.disabled };
        }

        r[account.docId].campaigns = campaignData.filter(x => x.accountId === account.docId).reduce((r2, campaign) => {

            if (!r2[campaign.docId]) {
                r2[campaign.docId] = { ...campaign, id: campaign.docId, enabled: !campaign.disabled, accountName: r[account.docId].companyName };
            }

            r2[campaign.docId].ads = adData.filter(x => x.campaignId === campaign.docId).reduce((r3, ad) => {

                if (!r3[ad.docId]) {
                    r3[ad.docId] = { ...ad, id: ad.docId, enabled: !ad.disabled, accountName: r[account.docId].companyName, campaignName: r2[campaign.docId].name };
                }

                return r3;
            }, {});

            r2[campaign.docId].adCount = Object.values(r2[campaign.docId].ads).length

            return r2;
        }, {});

        r[account.docId].campaignCount = Object.values(r[account.docId].campaigns).length

        try {
            r[account.docId].ads = Object.values(r[account.docId].campaigns).map(x => Object.values(x.ads)).reduce((r2, adList) => {
                adList.forEach(x => {
                    if (!r2[x.docId]) {
                        r2[x.docId] = x;
                    }
                });
                return r2;
            }, {});

            r[account.docId].adCount = Object.values(r[account.docId].ads).length;
        } catch (ex) { console.log(ex) }

        return r;
    }, {});

    return result;
}

export function getAllAdData() {

    return new Promise((resolve, reject) => {

        let accountData = null;
        let campaignData = null;
        let adData = null;

        let finalize = () => {

            if (accountData && campaignData && adData) {

                resolve(createDataTree(accountData, campaignData, adData));
            }
        }

        getAccounts().then(accounts => {
            accountData = accounts;
            finalize();
        }, reject).catch(reject);

        getCampaigns().then(campaigns => {
            campaignData = campaigns;
            finalize();
        }, reject).catch(reject);

        getAds().then(ads => {
            adData = ads;
            finalize();
        }, reject).catch(reject);
    });
}


