import podcasts from "./content.js";
import { pipeline } from "@xenova/transformers";
import { supabase } from "../lib.js";

async function main(input) {
  try {
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

    const embeddings = await Promise.all(
      input.map(async (textChunk) => {
        try {
          const result = await embedder(textChunk, {
            pooling: "mean",
            normalize: true,
          });

          const data = {
            content: textChunk,
            embedding: Array.from(result.data),
          };
          console.log("Embedding generated successfully", data);

          await saveTextEmbedToSupabase(data);
          console.log("successfully saved to supabase db");
        } catch (error) {
          console.error(`Error processing chunk: ${error.message}`);
          return null;
        }
      })
    );

    // Filter out any failed embeddings
    const successfulEmbeddings = embeddings.filter(Boolean);
    console.log(
      `Successfully processed ${successfulEmbeddings.length} out of ${input.length} chunks`
    );
    console.log("Embedding complete!");
  } catch (error) {
    console.error("Failed to load model:", error.message);
  }
}

async function saveTextEmbedToSupabase(embed) {
  try {
    const { data, error } = await supabase
      .from("documents")
      .insert(embed)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
  } catch (error) {
    throw new Error(error.message);
  }
}

main(podcasts);
