import { UploadForm } from "@/components/upload-form"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-between p-24 max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-4">
        <Image 
          src="https://dweb.mypinata.cloud/ipfs/QmVFFsrkNjuKVUnViY7kFqFXwPm3ExpckhvA6SMBNrzaJW" 
          width={400}
          height={400}
          alt="image"
        />
      </div>
      <UploadForm />
    </main>
  );
}
