export async function uploadURL(url: string) {
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
    const urlStream = await fetch(url);
    const arrayBuffer = await urlStream.arrayBuffer();
    const blob = new Blob([arrayBuffer]);

    const formData = new FormData();
    formData.append("file", blob);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    const uploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
        },
        body: formData,
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
