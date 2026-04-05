export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  date: string;
  imageUrl?: string;
  servingSize?: string;
  micronutrients?: {
    vitaminA?: number;
    vitaminC?: number;
    iron?: number;
    calcium?: number;
    sodium?: number;
    sugar?: number;
  };
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserProfile {
  name: string;
  email: string;
  goals: DailyGoals;
  joinedDate: string;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  entries: FoodEntry[];
}
