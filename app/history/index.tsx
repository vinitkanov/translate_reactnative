import { useFocusEffect, useRouter } from "expo-router";
import { History, House, Settings, Trash2 } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  deleteTranslation,
  getTranslationHistory,
  TranslationRecord,
} from "../utils/storage";

export default function HistoryScreen() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<TranslationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await getTranslationHistory();
      // Reverse the array to show the newest item first (common practice for history screens)
      setHistoryItems(items.reverse());
    } catch (error) {
      console.error("Error loading history:", error);
      Alert.alert("Error", "Gagal memuat history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Hapus", "Yakin ingin menghapus item ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const success = await deleteTranslation(id);
          if (success) {
            loadHistory();
            Alert.alert("Success", "Item berhasil dihapus");
          }
        },
      },
    ]);
  };

  const handleItemPress = (item: TranslationRecord) => {
    // Pass semua data langsung via params
    router.push({
      pathname: "/detail",
      params: {
        id: item.id,
        sourceText: item.sourceText,
        translatedText: item.translatedText,
        fromLang: item.fromLang,
        toLang: item.toLang,
        timestamp: item.timestamp,
      },
    });
  };

  const renderHistoryItem = ({ item }: { item: TranslationRecord }) => {
    // NOTE: This assumes item.timestamp format is "HH:MM:SS DD/MM/YYYY" or similar
    // and we want "DD/MM/YYYY, HH:MM:SS" like in the screenshot.
    // If your item.timestamp is already correctly formatted, just use item.timestamp
    const parts = item.timestamp.split(" ");
    let displayTimestamp = item.timestamp; // Fallback
    if (parts.length >= 2) {
      // Assuming parts[0] is time (17:59:20) and parts[1] is date (4/12/2025)
      displayTimestamp = `${parts[1]}, ${parts[0]}`;
    }

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        {/* Timestamp and Delete Icon */}
        <View style={styles.historyHeader}>
          <Text style={styles.timestamp}>{displayTimestamp}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
          >
            <Trash2 size={18} color="#d32f2f" />
          </TouchableOpacity>
        </View>

        {/* Source Text (Original) - FIX: Use item.sourceText */}
        <Text style={styles.itemText} numberOfLines={3}>
          {item.sourceText}
        </Text>

        {/* Down Arrow */}
        <Text style={styles.arrow}>↓</Text>

        {/* Translated Text - FIX: Use item.translatedText */}
        <Text style={styles.translatedText} numberOfLines={3}>
          {item.translatedText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>History</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : historyItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <History size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada riwayat terjemahan</Text>
            <Text style={styles.emptySubtext}>
              Terjemahan yang kamu simpan akan muncul di sini
            </Text>
          </View>
        ) : (
          <FlatList
            data={historyItems}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/")}
        >
          <House size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 44,
    paddingHorizontal: 26,
    paddingBottom: 120,
  },
  title: {
    fontSize: 48,
    fontFamily: "serif",
    fontStyle: "italic",
    marginBottom: 22,
    color: "#000",
    fontWeight: "400",
  },
  listContent: {
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  historyItem: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  arrow: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 4,
  },
  translatedText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    fontStyle: "italic",
    marginTop: 8,
  },
  deleteButton: {
    padding: 4,
  },
  spacer: {
    height: 20,
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
    paddingBottom: 30,
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
});
