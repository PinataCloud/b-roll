"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { uploadFile } from "@/utils/upload-fils";
import { uploadJSON } from "@/utils/uload-json";
import { Loader2 } from "lucide-react";
import { uploadURL } from "@/utils/upload-url";
import Link from "next/link";
import {useProfile} from "@farcaster/auth-kit";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function UploadForm() {
  const [selectedFile, setSelecteFile]: any = useState();
  const [loading, setLoading] = useState(false);
  const [frameLink, setFrameLink] = useState("");
  const {
    isAuthenticated,
    profile: { fid },
  } = useProfile();

  async function fileChangeHandler(event: any) {
    const file = event.target.files[0];
    setSelecteFile(file);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const fileCID = await uploadFile(selectedFile);
    console.log(fileCID);

    const gifBody = JSON.stringify({
      url: `https://dweb.mypinata.cloud/ipfs/${fileCID}`,
    });

    const gifReq = await fetch(`/api/gif`, {
      method: "POST",
      body: gifBody,
    });

    const gifRes = await gifReq.json();
    console.log(gifRes);

    const gifCID = await uploadURL(gifRes);

    const data = {
      image: gifCID,
      video: fileCID,
    };

    console.log(data);
    const jsonCID = await uploadJSON(data);

    setFrameLink(`${process.env.NEXT_PUBLIC_BASE_URL}/frame/${jsonCID}/user/${fid}`);
    setLoading(false);
  }
  async function reset() {
    setFrameLink("");
    setSelecteFile("");
  }

  function ButtonLoading() {
    return (
      <Button className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Uploading your banger, making a frame
      </Button>
    );
  }

  return (
    <div className="border p-8 rounded-lg">
      {frameLink ? (
        <div className="flex flex-col gap-4">
          <Link
            href={`https://warpcast.com/~/compose?text=!b-roll&embeds[]=${frameLink}`}
            target="_blank"
          >
            <Button className="w-full bg-purple-600 text-white gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="white"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21l18 0" />
                <path d="M4 21v-15a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v15" />
                <path d="M9 21v-8a3 3 0 0 1 6 0v8" />
              </svg>
              Share on Warpcast
            </Button>
          </Link>
          <Button className="w-full" onClick={reset}>Make Another</Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Input
              placeholder="file"
              type="file"
              onChange={fileChangeHandler}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My cool video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              ButtonLoading()
            ) : (
              <Button className="w-full" type="submit">
                Submit
              </Button>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}
