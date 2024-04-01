import Image from "next/image"
import { headers } from 'next/headers'

import React from 'react'
import {Avatar, Box, Card, CardContent, Typography} from "@mui/material";

export default async function Video(params: any) {

    console.log('full url', params);
    const videoCID = params.params.uri;
    const castId = params.params.castId;
    const pinataVideo = `https://dweb.mypinata.cloud/ipfs/${videoCID}`;

    console.log('videoCID', videoCID);

    const hashRes = await fetch(`https://api.devpinata.cloud/v3/farcaster/casts/${castId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        }
    }).then((res) => res.json())
        .catch((err) => {
        console.log('err', err);
    });

    console.log('hashRes', hashRes);
    const fid = hashRes.data.fid;
    //
    // //fetch user by fid with this endpoint https://api.pinata.cloud/v3/farcaster/users/{fid}
    const userData = await fetch(`https://api.devpinata.cloud/v3/farcaster/users/${fid}`, {
        headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
    })
    const fcUser = await userData.json();
    console.log('fcUser', fcUser);
    //
    // console.log(fcUser)
    //
    return <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    }}>
        <Box style={{width: 1200, height: 600}}>
        <video style={{height: "100%"}} autoPlay controls>
            <source src={pinataVideo} type="video/mp4"/>
        </video>
        </Box>
        <Box>
            <Card>
                <CardContent>
                    <Typography>{fcUser.data.display_name}</Typography>
                    <Typography>{fcUser.data.bio}</Typography>
                    <Avatar alt="Remy Sharp" src={fcUser.data.pfp_url} />
                </CardContent>
            </Card>
        </Box>

    </Box>
}
