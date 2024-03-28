"use client";
import { UploadForm } from "@/components/upload-form"
import Image from "next/image"

import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';
import {Auth} from "@/components/auth";
import {NextUIProvider} from "@nextui-org/react";


const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'example.com',
  siweUri: 'https://example.com/login',
};

export default function Home() {
  return (
      <NextUIProvider>
          <AuthKitProvider config={config}>
            <main className="flex min-h-screen flex-row items-center justify-between p-24 max-w-screen-lg mx-auto">
              <div className="flex flex-col gap-4">
                <Image
                  src="https://dweb.mypinata.cloud/ipfs/QmVFFsrkNjuKVUnViY7kFqFXwPm3ExpckhvA6SMBNrzaJW"
                  width={400}
                  height={400}
                  alt="image"
                />
              </div>
              <Auth />
            </main>
          </AuthKitProvider>
      </NextUIProvider>
  );
}
