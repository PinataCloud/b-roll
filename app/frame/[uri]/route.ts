import { NextRequest, NextResponse } from "next/server";
import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
  pinata_jwt: `${process.env.PINATA_JWT}`,
  pinata_gateway: `${process.env.GATEWAY_URL}`,
});

type Params = {
  uri: string;
};

export async function GET(request: Request, context: { params: Params }) {
  const cid = context.params.uri;
  const jsonReq = await fetch(`https://dweb.mypinata.cloud/ipfs/${cid}`);
  const data = await jsonReq.json();
  console.log(data);
  try {
    const frameMetadata = fdk.getFrameMetadata({
      aspect_ratio: "1:1",
      cid: data.image,
      buttons: [
        {
          label: "Watch Video",
          action: "link",
          target: `https://dweb.mypinata.cloud/ipfs/${data.video}`,
        },
      ],
    });
    return new NextResponse(frameMetadata);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
