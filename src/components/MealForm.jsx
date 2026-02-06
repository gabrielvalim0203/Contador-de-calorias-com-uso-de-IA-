import { useState, useMemo } from 'react';
import { Plus, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export function MealForm({ onAdd, history }) {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Filter history based on input
    const suggestions = useMemo(() => {
        if (!name) return [];
        return history.filter(h =>
            h.name.toLowerCase().includes(name.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions
    }, [name, history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !calories) return;
        onAdd(name, calories);
        setName('');
        setCalories('');
        setShowSuggestions(false);
    };

    const selectSuggestion = (suggestion) => {
        setName(suggestion.name);
        setCalories(suggestion.calories.toString());
        setShowSuggestions(false);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Adicionar Refeição</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                        O que você comeu?
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="Ex: Arroz com feijão"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {suggestions.map((s) => (
                                <button
                                    key={s.id || s.name}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex justify-between items-center text-sm"
                                    onClick={() => selectSuggestion(s)}
                                >
                                    <span className="font-medium text-slate-700">{s.name}</span>
                                    <span className="text-slate-500 flex items-center gap-1">
                                        {s.calories} kcal <Clock size={12} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                        Calorias (kcal)
                    </label>
                    <input
                        type="number"
                        inputMode="numeric"
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="Ex: 350"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!name || !calories}
                    className={cn(
                        "w-full py-3 rounded-md text-white font-medium flex items-center justify-center gap-2 transition-colors",
                        (!name || !calories)
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                >
                    <Plus size={20} />
                    Adicionar
                </button>
            </form>
        </div>
    );
}
