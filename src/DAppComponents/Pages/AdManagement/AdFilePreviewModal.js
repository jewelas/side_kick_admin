import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

export default function AdFilePreviewModal({ name, fileLink }) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={setIsModalOpen.bind(null, true)}
                style={{ fontSize: "1.5rem" }}
                className="m-2 btn-gradient shadow-none bg-sidekick-dark text-primary font-weight-bold text-uppercase"
            >
                <FontAwesomeIcon icon={["fas", "eye"]} />
            </Button>
            <Dialog
                open={isModalOpen}
                scroll="body"
                maxWidth="sm"
                fullWidth={true}
                onClose={setIsModalOpen.bind(null, false)}
                classes={{ paper: 'border-0 bg-first text-white' }} >
                <DialogTitle style={{ textAlign: "center" }}>
                    {name}
                </DialogTitle>
                <DialogContent style={{ textAlign: "center" }}>
                    <img style={{ maxWidth: "100%", marginBottom: "3rem" }} src={fileLink} />
                </DialogContent>
            </Dialog>
        </>
    )
}