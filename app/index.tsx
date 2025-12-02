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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  House,
  History,
  Bolt,
  ArrowRightLeft,
  ChevronDown,
  Copy,
  Save,
} from "lucide-react-native";
import { push } from "expo-router/build/global-state/routing";
import { router, useRouter } from "expo-router";

export default function Index() {
  const router=useRouter();
import { useRouter } from "expo-router";
const LANGUAGES = [
  { code: "auto", name: "Auto" },
  { code: "en", name: "English" },
  { code: "id", name: "Indonesia" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
];

export default function Index() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("id");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSourceLangs, setShowSourceLangs] = useState(false);
  const [showTargetLangs, setShowTargetLangs] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);

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

  const translateText = async (text) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text",
        }),
      });

      const data = await response.json();
      if (data.translatedText) {
        setOutputText(data.translatedText);
      } else {
        setOutputText("Translation failed. Please try again.");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setOutputText("Error connecting to translation service.");
    } finally {
      setIsTranslating(false);
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

  const copyToClipboard = () => {
    if (outputText) {
      Alert.alert("Copied!", "Translation copied to clipboard");
    }
  };

  const saveTranslation = () => {
    if (inputText && outputText) {
      const newEntry = {
        id: Date.now(),
        source: inputText,
        target: outputText,
        sourceLang,
        targetLang,
        date: new Date().toLocaleString(),
      };
      setTranslationHistory([newEntry, ...translationHistory]);
      Alert.alert("Saved!", "Translation saved to history");
    }
  };
  const router = useRouter();

  const LanguageSelector = ({ isSource, visible, onClose }) => {
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

  const getLanguageName = (code) => {
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
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
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
          style={styles.actionButton}
          onPress={saveTranslation}
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

      {/* Bottom Navigation */}
      <View style={styles.navBottom}>
        <TouchableOpacity style={styles.navButton}>
          <House size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/history")}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/history")}
        >
          <History size={24} color="#000" />
          <Text style={styles.navText}>
            History ({translationHistory.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Bolt size={24} color="#000" />
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
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "#fff",
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
