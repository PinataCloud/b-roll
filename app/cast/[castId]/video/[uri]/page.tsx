import Image from "next/image"
import { headers } from 'next/headers'

import React from 'react'
import {Avatar, Box, Card, CardContent, Paper, Typography} from "@mui/material";

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
    console.log('reactions', hashRes.data.reactions);
    console.log('embeds', hashRes.data.embeds);
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

    const repliesRes = await fetch(`https://api.devpinata.cloud/v3/farcaster/casts?parentHash=${castId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
    })

    const replies = await repliesRes.json();
    console.log('replies', replies.data.casts)

    return <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        width: "100%"
    }}>
        <Box sx={{width: "75%"}}>
            <Box style={{maxHeight: 800}}>
            <video style={{width: "100%", height: "100%"}} autoPlay controls>
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
                Likes: {hashRes.data.reactions?.likes?.length}
            </Box>
            <Box sx={{width: "100%"}}>
                <Paper sx={{width: "100%"}}>
                    <Typography variant={"h5"} sx={{mt: 2, mb: 2}}>{replies.data.casts.length} comments</Typography>
                    {replies.data.casts.map((cast: any) => {
                        return <Card>
                            <CardContent sx={{backgroundColor: "black"}}>
                                <Typography>{cast.author.display_name}</Typography>
                                <Avatar alt="Remy Sharp" src={cast.author.pfp_url} />
                                <Typography>{cast.content}</Typography>
                            </CardContent>
                        </Card>
                    })}
                </Paper>
            </Box>
        </Box>
        <Box sx={{border: "1px solid red", width: "25%"}}>
            Side content
        </Box>
    </Box>
}
