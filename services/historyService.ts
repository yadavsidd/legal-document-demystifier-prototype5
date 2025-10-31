import type { HistoryItem, HistoryItemForCreation } from '../types';

const HISTORY_KEY = 'lexiplain_history';

/**
 * Retrieves the analysis history from local storage.
 * @returns An array of HistoryItem, sorted with the most recent first.
 */
export const getHistory = (): HistoryItem[] => {
  try {
    const rawHistory = localStorage.getItem(HISTORY_KEY);
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
 */
// FIX: Changed parameter type from Omit<HistoryItem, 'id'> to the new HistoryItemForCreation
// to correctly handle discriminated union types and resolve errors at call sites.
export const saveHistoryItem = (item: HistoryItemForCreation): void => {
  try {
    const history = getHistory();
    
    const newHistoryItem: HistoryItem = {
      ...item,
      id: Date.now(),
    } as HistoryItem; // Cast needed because Omit loses discriminated union props

    const updatedHistory = [newHistoryItem, ...history];

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history item to localStorage", error);
  }
};