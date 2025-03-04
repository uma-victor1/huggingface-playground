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

    // First, check if we have any existing documents
    const { count: existingCount } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true });

    console.log(`Existing documents in database: ${existingCount}`);

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
        console.log("Embedding dimension:", data.embedding.length);

        await saveTextEmbedToSupabase(data);
        console.log("Successfully saved to supabase db");
      } catch (error) {
        console.error(`Error processing chunk: ${error.message}`);
      }
    }

    // Verify documents were saved
    const { count: finalCount } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true });

    console.log(`Final document count: ${finalCount}`);
    console.log("Embedding complete!");
  } catch (error) {
    console.error("Failed to load model:", error.message);
  }
}

async function saveTextEmbedToSupabase(embed) {
  try {
    console.log("Attempting to save to Supabase...");
    const { data, error } = await supabase
      .from("documents")
      .insert(embed)
      .select();

    if (error) {
      console.error("Supabase error details:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.warn("No data returned from Supabase insert");
      return;
    }

    console.log("Successfully saved document:", data[0]);
  } catch (error) {
    console.error("Error in saveTextEmbedToSupabase:", error);
    throw error;
  }
}

main(podcasts);
