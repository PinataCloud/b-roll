'use client';
import Image from "next/image"

import { usePathname } from 'next/navigation'

import React from 'react'
import {Avatar, Box, Card, CardContent, Typography} from "@mui/material";


export default async function Video() {
    const pathname = usePathname();
    const cid = pathname.split('/').pop();
    const fid = pathname.split('/')[2];
    const pinataVideo = `https://dweb.mypinata.cloud/ipfs/${cid}`;

    //fetch user by fid with this endpoint https://api.pinata.cloud/v3/farcaster/users/{fid}
    const userData = await fetch(`http://localhost:8080/farcaster/users/${fid}`, {
        headers: {
            'Authorization': 'Bearer 123'
        }
    })
    const fcUser = await userData.json();

    console.log(fcUser)

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
