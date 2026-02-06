import { useState } from 'react';
import { useMeals } from './hooks/useMeals';
import { MealForm } from './components/MealForm';
import { MealList } from './components/MealList';
import { DailySummary } from './components/DailySummary';
import { HistoryView } from './components/HistoryView';
import { Settings } from './components/Settings';
import { AIInput } from './components/AIInput';
import { Utensils, History, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from './lib/utils';

function App() {
  const {
    currentMeals,
    addMeal,
    removeMeal,
    totalCalories,
    goal,
    setGoal,
    history,
    apiKey,
    setApiKey,
    selectedDate,
    setSelectedDate,
    historyDays,
    completeDay
  } = useMeals();

  const [activeTab, setActiveTab] = useState('summary'); // summary, history, settings

  const handleAddMeal = (name, calories) => {
    addMeal(name, calories, selectedDate);
  };

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Utensils size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent leading-tight">
                Diário Alimentar
              </h1>
              {!isToday && activeTab === 'summary' && (
                <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                  Visualizando: {format(selectedDate, "dd/MM", { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'summary' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <DailySummary
              total={totalCalories}
              goal={goal}
              onUpdateGoal={setGoal}
              onCompleteDay={() => {
                if (window.confirm(`Tem certeza que deseja fechar o dia?\n\nTotal consumido: ${totalCalories} kcal\n\nIsso irá salvar o histórico e iniciar um novo dia em branco.`)) {
                  completeDay();
                }
              }}
            />

            <AIInput apiKey={apiKey} onAddMeals={handleAddMeal} />

            <MealForm
              onAdd={handleAddMeal}
              history={history}
            />

            <MealList
              meals={currentMeals}
              onDelete={removeMeal}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <HistoryView
              days={historyDays}
              goal={goal}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setActiveTab('summary');
              }}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Settings apiKey={apiKey} onSaveApiKey={setApiKey} />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 safe-area-pb z-30">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => {
              setActiveTab('summary');
              if (!isToday && activeTab !== 'history') setSelectedDate(new Date()); // Reset to today if clicking home
            }}
            className={cn("flex flex-col items-center gap-1", activeTab === 'summary' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs font-medium">Hoje</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={cn("flex flex-col items-center gap-1", activeTab === 'history' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}
          >
            <History size={24} />
            <span className="text-xs font-medium">Histórico</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={cn("flex flex-col items-center gap-1", activeTab === 'settings' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}
          >
            <SettingsIcon size={24} />
            <span className="text-xs font-medium">Config</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
