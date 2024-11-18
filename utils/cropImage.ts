export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous"; // To avoid CORS issues
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
  
            const croppedFile = new File([blob], "cropped-image.jpg", {
              type: "image/jpeg",
            });
            resolve(croppedFile);
          },
          "image/jpeg",
          1
        );
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  };
  