import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TranslationRecord {
  id: string;
  fromLang: string;
  toLang: string;
  sourceText: string;
  translatedText: string;
  timestamp: string;
}

const STORAGE_KEY = "translation_history";

export async function saveTranslation(
  fromLang: string,
  toLang: string,
  sourceText: string,
  translatedText: string,
): Promise<TranslationRecord | null> {
  try {
    const newRecord: TranslationRecord = {
      id: Date.now().toString(),
      fromLang,
      toLang,
      sourceText,
      translatedText,
      timestamp: new Date().toLocaleString("id-ID"),
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const history: TranslationRecord[] = existing ? JSON.parse(existing) : [];

    history.unshift(newRecord);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return newRecord;
  } catch (error) {
    console.error("Error saving translation:", error);
    return null;
  }
}

export async function getTranslationHistory(): Promise<TranslationRecord[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error fetching translation history:", error);
    return [];
  }
}

export async function deleteTranslation(id: string): Promise<boolean> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) return false;

    const history: TranslationRecord[] = JSON.parse(existing);
    const filtered = history.filter((item) => item.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting translation:", error);
    return false;
  }
}

export async function clearTranslationHistory(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
}
