import { GoogleGenAI } from "@google/genai";
import { AppState, TransactionType } from '../types';

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialInsights = async (state: AppState): Promise<string> => {
  const ai = getGeminiClient();
  if (!ai) return "Unable to generate insights: API Key missing.";

  const recentExpenses = state.transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .slice(0, 20); // Last 20 expenses to save context window
    
  const totalIncome = state.transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = state.transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeSubs = state.subscriptions.filter(s => s.isActive);

  const prompt = `
    I am an Indian student/young earner. Analyze my financial data below and give me 3 short, punchy, friendly insights or warnings in a list format.
    Focus on "Rupee" savings, unnecessary subscriptions, or high spending categories.
    Currency: INR (₹).

    Data:
    - Total Income: ₹${totalIncome}
    - Total Expenses: ₹${totalExpense}
    - Active Subscriptions: ${activeSubs.map(s => `${s.name} (₹${s.amount}/${s.frequency})`).join(', ')}
    - Recent Expenses: ${JSON.stringify(recentExpenses.map(e => ({ cat: e.category, amt: e.amount, note: e.note })))}

    Tone: Friendly, encouraging, like a smart older sibling.
    Output: Plain text, bullet points. No markdown bolding.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I'm having trouble analyzing your finances right now. Please try again later.";
  }
};