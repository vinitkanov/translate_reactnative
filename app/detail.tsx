import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Copy,
  Trash2,
  House,
  History as HistoryIcon,
  Settings,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteTranslation } from "./utils/storage";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = params.id as string;
  const sourceText = params.sourceText as string;
  const translatedText = params.translatedText as string;
  const fromLang = params.fromLang as string;
  const toLang = params.toLang as string;
  const timestamp = params.timestamp as string;

  const handleCopySource = async () => {
    await Clipboard.setString(sourceText);
    Alert.alert("Copied!", "Original text copied to clipboard");
  };

  const handleCopyTranslation = async () => {
    await Clipboard.setString(translatedText);
    Alert.alert("Copied!", "Translation copied to clipboard");
  };

  const handleCopyAll = async () => {
    const textToCopy = `${sourceText}\n\n${translatedText}`;
    await Clipboard.setString(textToCopy);
    Alert.alert("Copied!", "All text copied to clipboard");
  };

  const handleDelete = () => {
    Alert.alert("Hapus", "Yakin ingin menghapus item ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const success = await deleteTranslation(id);
          if (success) {
            Alert.alert("Success", "Item berhasil dihapus", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } else {
            Alert.alert("Error", "Gagal menghapus item");
          }
        },
      },
    ]);
  };

  if (!id || !sourceText || !translatedText) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item tidak ditemukan</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Detail</Text>

        <Text style={styles.timestamp}>{timestamp}</Text>

        <View style={styles.textBox}>
          <View style={styles.textBoxHeader}>
            <Text style={styles.textBoxLabel}>{sourceText}</Text>
            <TouchableOpacity
              style={styles.copyIcon}
              onPress={handleCopySource}
            >
              <Copy size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.textContent}>{fromLang}</Text>
        </View>

        <View style={styles.textBox}>
          <View style={styles.textBoxHeader}>
            <Text style={styles.textBoxLabel}>{translatedText}</Text>
            <TouchableOpacity
              style={styles.copyIcon}
              onPress={handleCopyTranslation}
            >
              <Copy size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.textContent}>{toLang}</Text>
        </View>

        <TouchableOpacity style={styles.copyAllButton} onPress={handleCopyAll}>
          <Text style={styles.copyAllButtonText}>Copy All</Text>
          <Copy size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
          <Trash2 size={20} color="#ff0000" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/")}
        >
          <House size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/history")}
        >
          <HistoryIcon size={24} color="#000" />
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 48,
    fontFamily: "serif",
    fontStyle: "italic",
    color: "#000",
    fontWeight: "400",
    marginBottom: 20,
  },
  timestamp: {
    fontSize: 13,
    color: "#999",
    marginBottom: 32,
  },
  textBox: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  textBoxLabel: {
    fontSize: 12,
    color: "#999",
  },
  copyIcon: {
    padding: 4,
  },
  textContent: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  copyAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  copyAllButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff0000",
    paddingVertical: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#ff0000",
    fontWeight: "500",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 32,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 17,
    color: "#999",
    marginBottom: 32,
  },
  errorButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
});
