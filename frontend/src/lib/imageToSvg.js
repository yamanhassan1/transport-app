import ImageTracer from "imagetracerjs";

const MAX_DIMENSION = 256;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function isSupportedImage(file) {
  return ACCEPTED_TYPES.includes(file.type);
}

export function isImageTooLarge(file) {
  return file.size > MAX_BYTES;
}

function getImageData(bitmap) {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

async function drawViaBitmap(file) {
  const bitmap = await createImageBitmap(file);
  try {
    return getImageData(bitmap);
  } finally {
    bitmap.close();
  }
}

function drawViaImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        resolve(getImageData(img));
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode the image"));
    };
    img.src = url;
  });
}

async function readPixelData(file) {
  if (typeof createImageBitmap === "function") {
    return drawViaBitmap(file);
  }
  return drawViaImageElement(file);
}

export async function imageFileToSvg(file) {
  if (!isSupportedImage(file)) {
    throw new Error("Unsupported image type");
  }
  if (isImageTooLarge(file)) {
    throw new Error("Image too large");
  }
  const imagedata = await readPixelData(file);
  return ImageTracer.imagedataToSVG(imagedata, {
    numberofcolors: 16,
    roundcoords: 1,
    ltres: 0.5,
    qtres: 0.15,
  });
}