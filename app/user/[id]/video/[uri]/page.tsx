'use client';
import Image from "next/image"

import { usePathname } from 'next/navigation'

import React from 'react'


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

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '40px'
    }}>
        <div style={{width: 1200, height: 600, display: "flex", justifyContent: "center"}}>
        <video style={{height: "100%"}} autoPlay controls>
            <source src={pinataVideo} type="video/mp4"/>
        </video>
        </div>

                    {/*name={fcUser.data.display_name}*/}
                    {/*description={fcUser.data.bio}*/}
                    {/*avatarProps={{*/}
                    {/*    src: fcUser.data.pfp_url,*/}
                    {/*    radius: 'lg'*/}
                    {/*}}*/}


    </div>
}
