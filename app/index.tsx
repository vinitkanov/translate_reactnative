import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  House,
  History,
  Settings,
  ArrowRightLeft,
  ChevronDown,
  Copy,
  Save,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { saveTranslation } from "./utils/storage";

const LANGUAGES = [
  { code: "auto", name: "Auto" },
  { code: "en", name: "English" },
  { code: "id", name: "Indonesia" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
];

export default function Index() {
  const router = useRouter();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("id");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSourceLangs, setShowSourceLangs] = useState(false);
  const [showTargetLangs, setShowTargetLangs] = useState(false);

  // Debounced translation
  useEffect(() => {
    if (inputText.trim()) {
      const timer = setTimeout(() => {
        translateText(inputText);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setOutputText("");
    }
  }, [inputText, sourceLang, targetLang]);

  // Multi-API translation dengan fallback
  const translateText = async (text: string) => {
    if (!text.trim()) return;

    setIsTranslating(true);

    // Try API 1: MyMemory (Free, no API key needed, paling stabil!)
    try {
      const result = await translateWithMyMemory(text);
      if (result) {
        setOutputText(result);
        setIsTranslating(false);
        return;
      }
    } catch (error) {
      console.log("MyMemory failed, trying next API...");
    }

    // Try API 2: LibreTranslate (Fallback)
    try {
      const result = await translateWithLibreTranslate(text);
      if (result) {
        setOutputText(result);
        setIsTranslating(false);
        return;
      }
    } catch (error) {
      console.log("LibreTranslate failed, trying next API...");
    }

    // Try API 3: Lingva Translate (Fallback)
    try {
      const result = await translateWithLingva(text);
      if (result) {
        setOutputText(result);
        setIsTranslating(false);
        return;
      }
    } catch (error) {
      console.log("All APIs failed");
    }

    setOutputText(
      "Translation failed. Please check your connection and try again.",
    );
    setIsTranslating(false);
  };

  const translateWithMyMemory = async (
    text: string,
  ): Promise<string | null> => {
    try {
      const sourceLangCode = sourceLang === "auto" ? "auto" : sourceLang;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangCode}|${targetLang}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      return null;
    } catch (error) {
      console.error("MyMemory error:", error);
      return null;
    }
  };

  const translateWithLibreTranslate = async (
    text: string,
  ): Promise<string | null> => {
    try {
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang === "zh-CN" ? "zh" : targetLang,
          format: "text",
        }),
      });

      const data = await response.json();
      if (data.translatedText) {
        return data.translatedText;
      }
      return null;
    } catch (error) {
      console.error("LibreTranslate error:", error);
      return null;
    }
  };

  const translateWithLingva = async (text: string): Promise<string | null> => {
    try {
      const sourceLangCode = sourceLang === "auto" ? "auto" : sourceLang;
      const url = `https://lingva.ml/api/v1/${sourceLangCode}/${targetLang}/${encodeURIComponent(text)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.translation) {
        return data.translation;
      }
      return null;
    } catch (error) {
      console.error("Lingva error:", error);
      return null;
    }
  };

  const swapLanguages = () => {
    if (sourceLang === "auto") {
      Alert.alert(
        "Cannot swap",
        "Auto-detect cannot be used as target language",
      );
      return;
    }
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const copyToClipboard = async () => {
    if (outputText) {
      await Clipboard.setString(outputText);
      Alert.alert("Copied!", "Translation copied to clipboard");
    }
  };

  const handleSaveTranslation = async () => {
    if (inputText && outputText && !outputText.includes("failed")) {
      const success = await saveTranslation(
        inputText,
        outputText,
        getLanguageName(sourceLang),
        getLanguageName(targetLang),
      );

      if (success) {
        Alert.alert("Saved!", "Translation saved to history");
      } else {
        Alert.alert("Error", "Failed to save translation");
      }
    }
  };

  const LanguageSelector = ({
    isSource,
    visible,
    onClose,
  }: {
    isSource: boolean;
    visible: boolean;
    onClose: () => void;
  }) => {
    if (!visible) return null;

    const langs = isSource
      ? LANGUAGES
      : LANGUAGES.filter((l) => l.code !== "auto");

    return (
      <View style={styles.langSelector}>
        <ScrollView style={styles.langList}>
          {langs.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.langItem}
              onPress={() => {
                if (isSource) {
                  setSourceLang(lang.code);
                } else {
                  setTargetLang(lang.code);
                }
                onClose();
              }}
            >
              <Text style={styles.langItemText}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Translator</Text>
      </View>

      <View style={styles.langChooseBar}>
        <TouchableOpacity
          style={styles.langChooseButton}
          onPress={() => setShowSourceLangs(!showSourceLangs)}
        >
          <Text style={styles.langText}>{getLanguageName(sourceLang)}</Text>
          <ChevronDown size={20} color="#000" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
          <ArrowRightLeft size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.langChooseButton}
          onPress={() => setShowTargetLangs(!showTargetLangs)}
        >
          <Text style={styles.langText}>{getLanguageName(targetLang)}</Text>
          <ChevronDown size={20} color="#000" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      {showSourceLangs && (
        <LanguageSelector
          isSource={true}
          visible={showSourceLangs}
          onClose={() => setShowSourceLangs(false)}
        />
      )}

      {showTargetLangs && (
        <LanguageSelector
          isSource={false}
          visible={showTargetLangs}
          onClose={() => setShowTargetLangs(false)}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputTrans}
          placeholder="Tap to enter text..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          value={inputText}
          onChangeText={setInputText}
        />
      </View>

      <View style={styles.outputContainer}>
        <View style={styles.outputWrapper}>
          <TextInput
            style={styles.outputTrans}
            placeholder="Translation will appear here..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            editable={false}
            value={outputText}
          />
          {isTranslating && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#000" />
              <Text style={styles.loadingText}>Translating...</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            !outputText && styles.actionButtonDisabled,
          ]}
          onPress={copyToClipboard}
          disabled={!outputText}
        >
          <Copy size={20} color={outputText ? "#000" : "#ccc"} />
          <Text
            style={[
              styles.actionButtonText,
              !outputText && styles.disabledText,
            ]}
          >
            Copy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            !outputText && styles.actionButtonDisabled,
          ]}
          onPress={handleSaveTranslation}
          disabled={!outputText}
        >
          <Save size={20} color={outputText ? "#000" : "#ccc"} />
          <Text
            style={[
              styles.actionButtonText,
              !outputText && styles.disabledText,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navBottom}>
        <TouchableOpacity style={styles.navButton}>
          <House size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/history")}
        >
          <History size={24} color="#000" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/options")}
        >
          <Settings size={24} color="#000" />
          <Text style={styles.navText}>Option</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerText: {
    fontFamily: "serif",
    fontSize: 48,
    fontStyle: "italic",
    color: "#000",
    fontWeight: "400",
  },
  langChooseBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 8,
  },
  langChooseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  langText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  chevron: {
    marginLeft: 2,
  },
  swapButton: {
    padding: 8,
  },
  inputContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputTrans: {
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 140,
    backgroundColor: "#fff",
    color: "#000",
  },
  outputContainer: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  outputWrapper: {
    position: "relative",
  },
  outputTrans: {
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 140,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  loadingOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1.2,
    borderColor: "#000",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  actionButtonDisabled: {
    borderColor: "#ccc",
  },
  actionButtonText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  disabledText: {
    color: "#ccc",
  },
  navBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginBottom: 30,
  },
  navButton: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
  },
  langSelector: {
    position: "absolute",
    top: 140,
    left: 24,
    right: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    maxHeight: 300,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  langList: {
    padding: 8,
  },
  langItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  langItemText: {
    fontSize: 16,
    color: "#000",
  },
});
