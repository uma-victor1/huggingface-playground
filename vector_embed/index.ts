import podcasts from "./content.js";
import { pipeline } from "@xenova/transformers";

async function main(input) {
  try {
    // Use a smaller model that's more likely to download successfully
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        progress_callback: (progress) => {
          console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
        },
      }
    );

    console.log("Model loaded successfully!");

    for (const textChunk of input) {
      try {
        const result = await embedder(textChunk, {
          pooling: "mean",
          normalize: true,
        });

        const data = {
          content: textChunk,
          embedding: Array.from(result.data),
        };
        console.log("Embedding generated successfully");
        console.log(data);
      } catch (error) {
        console.error(`Error processing chunk: ${error.message}`);
      }
    }
    console.log("Embedding complete!");
  } catch (error) {
    console.error("Failed to load model:", error.message);
  }
}

main(podcasts);
