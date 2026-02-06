import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export function AIInput({ apiKey, onAddMeals }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (!apiKey) {
            setError('Por favor, configure sua API Key na aba de Configurações primeiro.');
            return;
        }

        setLoading(true);
        setError('');

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
        let lastError;
        let success = false;

        try {
            for (const modelName of modelsToTry) {
                try {
                    console.log(`Tentando modelo: ${modelName}`);
                    const genAI = new GoogleGenerativeAI(apiKey.trim());
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const prompt = `
                    Analise a seguinte descrição de refeição e retorne APENAS um JSON array.
                    Para cada item identificado, estime as calorias aproximadas.
                    Se a quantidade não for especificada, assuma uma porção média padrão.
                    Responda APENAS o JSON, sem markdown ou explicações.
                    Formato: [{"name": "Nome do item", "calories": número_inteiro}]
                    
                    Refeição: "${input}"
                `;

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    let text = response.text();

                    // Success! Process text
                    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    const meals = JSON.parse(text);

                    if (Array.isArray(meals)) {
                        let count = 0;
                        meals.forEach(meal => {
                            if (meal.name && typeof meal.calories === 'number') {
                                onAddMeals(meal.name, meal.calories);
                                count++;
                            }
                        });
                        if (count > 0) {
                            setInput('');
                            success = true;
                            break; // Stop trying other models
                        }
                    }
                } catch (err) {
                    console.warn(`Falha com modelo ${modelName}:`, err);
                    lastError = err;
                    // Continue to next model
                }
            }

            if (!success) {
                // Diagnostic: Try to list models explicitly
                let diagMsg = "";
                try {
                    const diagResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
                    const diagData = await diagResp.json();

                    if (diagData.error) {
                        diagMsg = `DIAGNÓSTICO: Sua chave retornou erro: ${diagData.error.message}`;
                    } else if (diagData.models) {
                        const available = diagData.models
                            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                            .map(m => m.name.replace("models/", ""));
                        diagMsg = `DIAGNÓSTICO: Sua chave tem acesso a: [${available.join(", ")}]. Porém, o app falhou ao usar os modelos padrão.`;
                    } else {
                        diagMsg = "DIAGNÓSTICO: Chave válida, mas nenhum modelo encontrado.";
                    }
                } catch (dInfo) {
                    diagMsg = "DIAGNÓSTICO: Falha de rede ao verificar chave.";
                }

                throw new Error(`Falha em todos os modelos. ${diagMsg} (Original: ${lastError?.message})`);
            }

        } catch (err) {
            console.error(err);
            setError(`Erro: ${err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1 rounded-2xl shadow-lg mb-6">
            <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-indigo-100 p-1.5 rounded-lg">
                        <Sparkles size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">IA Mágica</h3>
                </div>

                <form onSubmit={handleAnalyze} className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAnalyze(e);
                            }
                        }}
                        placeholder="Ex: 2 ovos fritos, 1 pão francês e café com leite..."
                        className="w-full p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm min-h-[80px]"
                    />

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={cn(
                            "absolute right-2 bottom-2 p-2 rounded-lg transition-all",
                            (loading || !input.trim())
                                ? "text-slate-400 bg-transparent"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                        )}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-xs mt-2 ml-1 leading-normal break-words">{error}</p>
                )}
            </div>
        </div>
    );
}
