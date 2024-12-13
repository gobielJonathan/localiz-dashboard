import OpenAI from "openai";

export const openai = new OpenAI({
    organization: "org-vb9TtNMOUoEPA2lQW9vY001R",
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_KEY
});
