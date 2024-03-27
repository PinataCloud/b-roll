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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function UploadForm() {
  const [selectedFile, setSelecteFile] = useState();
  const [loading, setLoading] = useState(false);
  const [frameLink, setFrameLink] = useState("");

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


    const gifCID = await uploadURL(gifRes)

    const data = {
      image: gifCID,
      video: fileCID,
    };

    console.log(data)
    const jsonCID = await uploadJSON(data);

    setFrameLink(`${process.env.NEXT_PUBLIC_BASE_URL}/frame/${jsonCID}`);
    setLoading(false);
  }

  function ButtonLoading() {
    return (
      <Button className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Input placeholder="file" type="file" onChange={fileChangeHandler} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading ? ButtonLoading() : <Button type="submit">Submit</Button>}
        </form>
      </Form>
      {frameLink && <p>{frameLink}</p>}
    </div>
  );
}
