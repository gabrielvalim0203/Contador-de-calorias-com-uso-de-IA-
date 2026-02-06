import { Trash2 } from 'lucide-react';

export function MealList({ meals, onDelete }) {
    if (meals.length === 0) {
        return (
            <div className="text-center py-10 text-slate-400">
                <p>Nenhuma refeição registrada hoje.</p>
                <p className="text-sm">Comece adicionando acima!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-slate-700 font-semibold text-lg">Histórico de Hoje</h3>
            {meals.map((meal) => (
                <div key={meal.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="font-medium text-slate-800">{meal.name}</p>
                        <p className="text-sm text-slate-500">{meal.calories} kcal</p>
                    </div>
                    <button
                        onClick={() => onDelete(meal.id)}
                        className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                        aria-label="Deletar refeição"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
}
