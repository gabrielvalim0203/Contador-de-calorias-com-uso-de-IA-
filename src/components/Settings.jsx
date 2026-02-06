import { useState } from 'react';
import { Key, Save, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export function Settings({ apiKey, onSaveApiKey }) {
    const [key, setKey] = useState(apiKey);
    const [show, setShow] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        onSaveApiKey(key);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <Key size={24} className="text-indigo-600" />
                    Configurações
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Chave da API do Google Gemini
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                            Necessário para o cálculo automático de calorias com IA.
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-1">
                                Obter chave grátis aqui.
                            </a>
                        </p>
                        <div className="relative">
                            <input
                                type={show ? "text" : "password"}
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Cole sua API Key aqui..."
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                                {show ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={cn(
                            "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
                            saved ? "bg-green-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        )}
                    >
                        {saved ? (
                            <>Salvo com sucesso!</>
                        ) : (
                            <>
                                <Save size={20} />
                                Salvar Configuração
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-800">
                <strong>Nota de Privacidade:</strong> Sua chave API fica salva apenas no seu dispositivo (navegador). Nenhuma informação é enviada para servidores externos além do próprio Google para processar o texto.
            </div>
        </div>
    );
}
