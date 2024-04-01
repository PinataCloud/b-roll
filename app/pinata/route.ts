import { NextRequest, NextResponse } from "next/server";
import { PinataFDK } from "pinata-fdk";

const fdk = new PinataFDK({
  pinata_jwt: `${process.env.PINATA_JWT}`,
  pinata_gateway: `${process.env.GATEWAY_URL}`,
});

type Params = {
  uri: string;
  castId: number;
};

export async function GET(request: Request, context: { params: Params }) {
  const cid = context.params.uri;
  const castId = context.params.castId;
  console.log('request', request);
  console.log('context', context);

  const jsonReq = await fetch(`https://dweb.mypinata.cloud/ipfs/${cid}`);
  const data = await jsonReq.json();
  try {
    const frameMetadata = fdk.getFrameMetadata({
      aspect_ratio: "1:1",
      cid: data.image,
      buttons: [
        {
          label: "Watch Video",
          action: "post_redirect",
          target: `${process.env.NEXT_PUBLIC_BASE_URL}/cast/${castId}/video/${data.video}`,
        },
      ],
    });
    return new NextResponse(frameMetadata);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
