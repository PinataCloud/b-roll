import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse){
  const data = await req.json()
  const gifBody = JSON.stringify({
    video_url: data.url,
    start_time: "0",
    duration: "2",
    speed: "0",
    size: "400x400"
  })
  try {
   const gifRequest = await fetch(`https://api.apyhub.com/generate/gif/url?output=test-sample.gif`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apy-token': `${process.env.GIF_API_KEY}`
      },
      body: gifBody
    })
    const gifRes = await gifRequest.json()
    const link = gifRes.data
    return NextResponse.json(link)
  } catch (error) {
    console.log(error)
    return NextResponse.json(error)
  }
}
