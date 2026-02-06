import { useState, useEffect } from 'react';
import { startOfDay, isSameDay, formatISO } from 'date-fns';

const STORAGE_KEY_MEALS = 'calorie_tracker_meals';
const STORAGE_KEY_HISTORY = 'calorie_tracker_history';
const STORAGE_KEY_GOAL = 'calorie_tracker_goal';
const STORAGE_KEY_API_KEY = 'calorie_tracker_api_key';

export function useMeals() {
    const [meals, setMeals] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_MEALS);
        return saved ? JSON.parse(saved) : [];
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        return saved ? JSON.parse(saved) : [];
    });

    const [goal, setGoal] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_GOAL);
        return saved ? parseInt(saved, 10) : 2000;
    });

    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
    });

    // Default to today
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(meals));
    }, [meals]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_GOAL, goal.toString());
    }, [goal]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
    }, [apiKey]);

    const addMeal = (name, calories, mealDate = selectedDate) => {
        const newMeal = {
            id: crypto.randomUUID(),
            name,
            calories: parseInt(calories, 10) || 0,
            date: mealDate.toISOString(),
        };

        setMeals((prev) => [newMeal, ...prev]);

        // Update history if unique (for auto-complete)
        setHistory((prev) => {
            const exists = prev.some(h =>
                h.name.toLowerCase() === name.toLowerCase() && h.calories === newMeal.calories
            );
            if (!exists) {
                return [{ name, calories: newMeal.calories, id: crypto.randomUUID() }, ...prev];
            }
            return prev;
        });
    };

    const removeMeal = (id) => {
        setMeals((prev) => prev.filter((m) => m.id !== id));
    };

    const getMealsForDate = (date) => {
        return meals.filter((meal) => isSameDay(new Date(meal.date), date));
    };

    const currentMeals = getMealsForDate(selectedDate);
    const totalCalories = currentMeals.reduce((acc, meal) => acc + meal.calories, 0);

    // Group meals by date for history view
    const mealsByDate = meals.reduce((groups, meal) => {
        const dateKey = formatISO(startOfDay(new Date(meal.date)));
        if (!groups[dateKey]) {
            groups[dateKey] = { date: new Date(meal.date), total: 0, items: [] };
        }
        groups[dateKey].total += meal.calories;
        groups[dateKey].items.push(meal);
        return groups;
    }, {});

    const historyDays = Object.values(mealsByDate).sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
        meals,
        currentMeals,
        history,
        addMeal,
        removeMeal,
        totalCalories,
        goal,
        setGoal,
        apiKey,
        setApiKey,
        selectedDate,
        setSelectedDate,
        historyDays
    };
}
