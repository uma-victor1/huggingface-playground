import { pipeline } from "@xenova/transformers";
import { supabase } from "../lib.js";

const query = "Recommend a 30 min podcast";

// get the embedding of the query
// get embedder with pipeline
// get text embed result with embedder
// query supabase with query embedding using rpc (match_documents)

async function main(query: string) {
  try {
    console.log("Loading model...");
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Generating query embedding...");
    const queryEmbedding = await embedder(query, {
      pooling: "mean",
      normalize: true,
    });
    const queryEmbeddingArray = Array.from(queryEmbedding.data);
    console.log("Query embedding dimension:", queryEmbeddingArray.length);

    console.log("Performing similarity search...");
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbeddingArray,
      match_threshold: 0.3,
      match_count: 3,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.log("No matching documents found");
      return;
    }

    console.log("Found matching documents:", data);
  } catch (error) {
    console.error("Error in similarity search:", error);
  }
}

main(query);
