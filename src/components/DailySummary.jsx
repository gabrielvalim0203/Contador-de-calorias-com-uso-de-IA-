import { cn } from '../lib/utils';
import { Target } from 'lucide-react';

export function DailySummary({ total, goal, onUpdateGoal }) {
    const percentage = Math.min(100, Math.round((total / goal) * 100));
    const isOver = total > goal;

    // Prompt user to update goal (simple implementation for MVP)
    const handleGoalClick = () => {
        const newGoal = prompt("Qual é a sua meta diária de calorias?", goal);
        if (newGoal && !isNaN(newGoal)) {
            onUpdateGoal(parseInt(newGoal, 10));
        }
    };

    return (
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-indigo-100 text-sm font-medium mb-1">Calorias Hoje</p>
                    <h1 className="text-4xl font-bold">{total}</h1>
                </div>
                <button onClick={handleGoalClick} className="bg-indigo-500/30 p-2 rounded-lg hover:bg-indigo-500/50 transition">
                    <div className="text-right">
                        <p className="text-xs text-indigo-200 uppercase tracking-wide flex items-center justify-end gap-1">
                            Meta <Target size={12} />
                        </p>
                        <p className="text-xl font-semibold">{goal}</p>
                    </div>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 bg-indigo-900/30 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full",
                        isOver ? "bg-red-400" : "bg-emerald-400"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-2 flex justify-between text-xs text-indigo-200">
                <span>0%</span>
                <span>{percentage}% da meta</span>
            </div>
        </div>
    );
}
