import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export function HistoryView({ days, onSelectDate, goal }) {
    if (days.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum histórico ainda.</p>
                <p className="text-sm">Seus registros aparecerão aqui.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Histórico</h2>
            {days.map((day) => {
                const percentage = Math.min(100, Math.round((day.total / goal) * 100));
                const isOver = day.total > goal;

                return (
                    <button
                        key={day.date.toISOString()}
                        onClick={() => onSelectDate(day.date)}
                        className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "w-2 h-12 rounded-full",
                                    isOver ? "bg-red-400" : "bg-emerald-400"
                                )}
                            />
                            <div className="text-left">
                                <p className="font-medium text-slate-800 capitalize">
                                    {format(day.date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {day.total} kcal / {goal}
                                </p>
                            </div>
                        </div>

                        <ChevronRight size={20} className="text-slate-300" />
                    </button>
                );
            })}
        </div>
    );
}
