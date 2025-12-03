import { useLocalSearchParams, useRouter } from "expo-router";
import { Copy, Trash2, ArrowLeft } from "lucide-react-native";
import React, { useState, useEffect } from "react";
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

  // Ambil data dari params
  const id = params.id as string;
  const sourceText = params.sourceText as string;
  const translatedText = params.translatedText as string;
  const fromLang = params.fromLang as string;
  const toLang = params.toLang as string;
  const timestamp = params.timestamp as string;

  const handleCopy = async (text: string) => {
    await Clipboard.setString(text);
    Alert.alert("Copied!", "Text copied to clipboard");
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
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } else {
            Alert.alert("Error", "Gagal menghapus item");
          }
        },
      },
    ]);
  };

  // Validasi data
  if (!id || !sourceText || !translatedText) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item tidak ditemukan</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButtonTop}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Detail</Text>
          <TouchableOpacity
            style={styles.deleteHeaderButton}
            onPress={handleDelete}
          >
            <Trash2 size={22} color="#d32f2f" />
          </TouchableOpacity>
        </View>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          <View style={styles.langBadge}>
            <Text style={styles.langBadgeText}>
              {fromLang} → {toLang}
            </Text>
          </View>
        </View>

        {/* Original Text */}
        <View style={styles.textContainer}>
          <View style={styles.textBox}>
            <View style={styles.textHeader}>
              <Text style={styles.textLabel}>Original Text</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopy(sourceText)}
              >
                <Copy size={18} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>{sourceText}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <Text style={styles.dividerText}>↓</Text>
          </View>

          {/* Translated Text */}
          <View style={styles.textBox}>
            <View style={styles.textHeader}>
              <Text style={styles.textLabel}>Translation</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopy(translatedText)}
              >
                <Copy size={18} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.textContent, styles.translatedContent]}>
              {translatedText}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCopy(translatedText)}
          >
            <Copy size={20} color="#000" />
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#d32f2f" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 26,
    paddingBottom: 60,
  },
  backButtonTop: {
    padding: 8,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontFamily: "serif",
    fontStyle: "italic",
    color: "#000",
    fontWeight: "400",
  },
  deleteHeaderButton: {
    padding: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  timestamp: {
    fontSize: 14,
    color: "#999",
  },
  langBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langBadgeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  textContainer: {
    gap: 16,
  },
  textBox: {
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
  },
  textHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  textLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  copyButton: {
    padding: 4,
  },
  textContent: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
  },
  translatedContent: {
    fontStyle: "italic",
    color: "#333",
  },
  divider: {
    alignItems: "center",
    paddingVertical: 8,
  },
  dividerText: {
    fontSize: 20,
    color: "#ccc",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1.2,
    borderColor: "#000",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  actionButtonText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  deleteButton: {
    borderColor: "#d32f2f",
  },
  deleteButtonText: {
    color: "#d32f2f",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
});
