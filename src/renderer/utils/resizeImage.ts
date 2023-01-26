interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

export const resizeImage = (settings: IResizeImageOptions) => {
  const { file, maxSize } = settings;
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  // Data to URI blob
  const dataURItoBlob = (dataURI: string) => {
    const bytes =
      dataURI.split(",")[0].indexOf("base64") >= 0
        ? atob(dataURI.split(",")[1])
        : unescape(dataURI.split(",")[1]);
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };

  // Resizing
  const resize = () => {
    let { width } = image;
    let { height } = image;

    // Checking width and height
    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    canvas?.getContext("2d")?.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    return dataURItoBlob(dataUrl);
  };

  // Result
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject(new Error("Not an image"));
      return;
    }

    // On load request
    reader.onload = (readerEvent: any) => {
      image.onload = () => resolve(resize());
      image.src = readerEvent.target.result;
    };

    // Reading as data URL
    reader.readAsDataURL(file);
  });
};
