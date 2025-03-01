import { hf } from "./lib";
import fs from "fs";

const text = "Hello, world! This is a test. I am an AI speaker. ";
const result = await hf.textToSpeech({
  model: "facebook/fastspeech2-en-ljspeech",
  inputs: text,
});

// Convert the Blob to ArrayBuffer, then to Buffer
const arrayBuffer = await result.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
fs.writeFileSync("output.wav", buffer);
