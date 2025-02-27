import { hf } from "./lib";

const result = await hf.translation({
  model: "facebook/mbart-large-50-many-to-many-mmt",
  inputs: "How are you?",
  parameters: {
    src_lang: "en_XX",
    tgt_lang: "fr_XX",
  },
});

console.log(result);
