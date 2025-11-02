import type { HistoryItem, HistoryItemForCreation } from '../types';

// Get history key based on user ID (if authenticated)
const getHistoryKey = (userId?: string | null): string => {
  if (userId) {
    return `lexiplain_history_${userId}`;
  }
  return 'lexiplain_history'; // Fallback for non-authenticated users
};

/**
 * Retrieves the analysis history from local storage.
 * @param userId Optional user ID to get user-specific history
 * @returns An array of HistoryItem, sorted with the most recent first.
 */
export const getHistory = (userId?: string | null): HistoryItem[] => {
  try {
    const historyKey = getHistoryKey(userId);
    const rawHistory = localStorage.getItem(historyKey);
    if (!rawHistory) {
      return [];
    }
    const history = JSON.parse(rawHistory) as HistoryItem[];
    // Sort by ID (timestamp) descending
    return history.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

/**
 * Saves a new item to the history.
 * @param item The history item to save, without an 'id' property.
 * @param userId Optional user ID to save user-specific history
 */
// FIX: Changed parameter type from Omit<HistoryItem, 'id'> to the new HistoryItemForCreation
// to correctly handle discriminated union types and resolve errors at call sites.
export const saveHistoryItem = (item: HistoryItemForCreation, userId?: string | null): void => {
  try {
    const historyKey = getHistoryKey(userId);
    const history = getHistory(userId);
    
    const newHistoryItem: HistoryItem = {
      ...item,
      id: Date.now(),
    } as HistoryItem; // Cast needed because Omit loses discriminated union props

    const updatedHistory = [newHistoryItem, ...history];

    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history item to localStorage", error);
  }
};