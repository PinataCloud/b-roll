import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


import React from 'react'
import {Avatar, Box, Button, Card, CardContent, Paper, Typography} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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
                <Box sx={{display: "flex", alignItems: "center", width: "100%", justifyContent: "flex-end", mb:2}}>
                    <FavoriteIcon sx={{cursor: "pointer"}}/>
                    <Typography>{hashRes.data.reactions?.likes?.length}</Typography>
                </Box>
                <Card>
                    <CardContent sx={{display: "flex", flexDirection: "column"}}>
                        <Typography sx={{fontWeight: 900}}>{fcUser.data.display_name}</Typography>
                        <Typography>{fcUser.data.bio}</Typography>
                        <Avatar alt="Remy Sharp" src={fcUser.data.pfp_url} />
                        <Box sx={{marginLeft: "auto"}}>
                            <Button variant={"contained"}>Follow</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{width: "100%"}}>
                        <Typography variant={"h6"} sx={{mt: 2, mb: 2}}>{replies.data.casts.length} comments</Typography>
                        {replies.data.casts.map((cast: any) => {
                        const someDate = dayjs(cast.timestamp); // Replace with your actual date
                        const prettyDate = someDate.fromNow();
                        return <Card sx={{mt: 2}}>
                            <CardContent>
                                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                    <Avatar alt="Remy Sharp" src={cast.author.pfp_url} />
                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                        <Box sx={{display: "flex", alignItems: "flex-end", gap: 1}}>
                                            <Typography sx={{fontWeight: 900}}>{cast.author.display_name}</Typography>
                                            <Typography variant={"caption"}>@{cast.author.username}</Typography>
                                            <Typography variant={"caption"}>{prettyDate}</Typography>
                                        </Box>
                                        <Typography>{cast.content}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{display: "flex", mt: 2, gap: 1, alignItems: "flex-end"}}>
                                    <FavoriteBorderIcon sx={{cursor: "pointer"}}/>
                                    <Typography sx={{fontWeight: 900}} variant={"caption"}>Reply</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    })}
            </Box>
        </Box>
        <Box sx={{border: "1px solid red", width: "25%"}}>
            Side content
        </Box>
    </Box>
}
