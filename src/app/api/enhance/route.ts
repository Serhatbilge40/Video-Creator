import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, apiKey } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenAI API Key is required for enhancement" },
                { status: 401 }
            );
        }

        const customOpenAI = createOpenAI({
            apiKey: apiKey,
        });

        const { text } = await generateText({
            model: customOpenAI("gpt-4o-mini"),
            prompt: `Enhance the following video generation prompt to make it highly detailed, cinematic, and professional. 
      Add specific details about lighting, camera angle, atmosphere, and visual style. 
      Keep the core subject the same. Output ONLY the enhanced prompt, nothing else.
      
      Original Prompt: ${prompt}`,
        });

        return NextResponse.json({ enhancedPrompt: text.trim() });
    } catch (error: any) {
        console.error("Enhance prompt error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to enhance prompt" },
            { status: 500 }
        );
    }
}
