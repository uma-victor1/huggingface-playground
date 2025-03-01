import { hf } from "./lib";
import fs from "fs";

const image = "/images/erencat.png";
const imageRes = await fetch(image);
const imageBuffer = await imageRes.arrayBuffer();
const imageBlob = new Blob([imageBuffer]);

const result = await hf.imageToImage({
  model: "CompVis/stable-diffusion-v1-4",
  inputs: imageBlob,
  parameters: {
    prompt: "turn to black and white",
    negative_prompt: "cat with no hair",
  },
});

console.log(result);
