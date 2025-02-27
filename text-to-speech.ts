import { hf } from "./lib";
import fs from "fs";

const text = "It's an exciting time to be an A.I. engineer.";
const result = await hf.textToSpeech({
  model: "facebook/fastspeech2-en-ljspeech",
  inputs: text,
});

// Convert the Blob to ArrayBuffer, then to Buffer
const arrayBuffer = await result.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
fs.writeFileSync("output.wav", buffer);
