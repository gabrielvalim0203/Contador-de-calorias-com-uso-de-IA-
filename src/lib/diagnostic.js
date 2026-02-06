
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "SUA_KEY_AQUI"; // O usuário substituirá isso ou passaremos via arg se fosse node puro, mas vamos fazer via browser console logica no componente temporariamente.
// Better approach: Create a temporary diagnostic component.

export async function checkModels(key) {
    try {
        const genAI = new GoogleGenerativeAI(key);
        // listModels is not directly exposed on genAI instance in basic SDK usage for browser, 
        // usually it's server side. But we can try a simple fetch to the endpoint manually to see what's up
        // or just try gemini-pro-vision etc.

        // Actually, let's try the most legacy model name that usually works.
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("Gemini Pro success", result);
        return "gemini-pro works";
    } catch (e) {
        console.error("Gemini Pro failed", e);
        return e.message;
    }
}
