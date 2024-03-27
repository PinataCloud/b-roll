export async function uploadJSON(content: any) {
  let key;
  let keyId;
  let fileCID;
  try {
    const tempKey = await fetch("/api/key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const keyData = await tempKey.json();
    key = keyData.JWT;
    keyId = keyData.pinata_api_key;
  } catch (error) {
    console.log("error making API key:", error);
  }

  try {
    const data = JSON.stringify({
      pinataContent: {
        image: content.image,
        video: content.video
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    const uploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: data,
      },
    );
    const uploadResJson = await uploadRes.json();
    fileCID = uploadResJson.IpfsHash;
    console.log(fileCID);
  } catch (error) {
    console.log("Error uploading file:", error);
  }

  try {
    const deleteData = JSON.stringify({
      apiKey: keyId,
    });
    console.log(deleteData);
    const deleteKey = await fetch("/api/key", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: deleteData,
    });
    const deleteJson = await deleteKey.json();
    console.log(deleteJson);
  } catch (error) {
    console.log("Error deleting API key:", error);
  }

  return fileCID;
}
