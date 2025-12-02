import { useFocusEffect, useRouter } from "expo-router";
import { Bolt, History, House, Trash2 } from "lucide-react-native";
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

  // Load history setiap kali screen di-focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await getTranslationHistory();
      setHistoryItems(items);
    } catch (error) {
      console.error("Error loading history:", error);
      Alert.alert("Error", "Gagal memuat history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Hapus", "Yakin ingin menghapus item ini?", [
      { text: "Batal", onPress: () => {} },
      {
        text: "Hapus",
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

  const renderHistoryItem = ({ item }: { item: TranslationRecord }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() =>
        Alert.alert(
          `${item.fromLang} → ${item.toLang}`,
          `"${item.sourceText}"\n\n↓\n\n"${item.translatedText}"`,
        )
      }
      activeOpacity={0.7}
    >
      <View style={styles.historyHeader}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        <Text style={styles.langBadge}>
          {item.fromLang} → {item.toLang}
        </Text>
      </View>
      <Text style={styles.itemText} numberOfLines={2}>
        {item.sourceText}
      </Text>
      <Text style={styles.arrow}>↓</Text>
      <Text style={styles.translatedText} numberOfLines={2}>
        {item.translatedText}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Trash2 size={18} color="#d32f2f" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
            <Text style={styles.emptyText}>Belum ada riwayat terjemahan</Text>
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

        <TouchableOpacity style={styles.navButton}>
          <Bolt size={24} color="#000" />
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
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#999",
  },

  historyItem: {
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    position: "relative",
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  timestamp: {
    fontSize: 12,
    color: "#999",
  },

  langBadge: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  itemText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
    marginBottom: 6,
  },

  arrow: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginVertical: 4,
  },

  translatedText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    fontStyle: "italic",
  },

  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
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
});
