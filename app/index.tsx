import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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

export default function Index() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Translator</Text>
      </View>

      <View style={styles.langChooseBar}>
        <TouchableOpacity style={styles.langChooseButton}>
          <Text style={styles.langText}>Auto</Text>
          <ChevronDown size={20} color="#000" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapButton}>
          <ArrowRightLeft size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.langChooseButton}>
          <Text style={styles.langText}>Indonesia</Text>
          <ChevronDown size={20} color="#000" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputTrans}
          placeholder="Tap to enter text..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.outputContainer}>
        <TextInput
          style={styles.outputTrans}
          placeholder="Sentuh untuk memasukan teks..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          editable={false}
        />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Copy size={20} color="#000" />
          <Text style={styles.actionButtonText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Save size={20} color="#000" />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navBottom}>
        <TouchableOpacity style={styles.navButton}>
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
  outputTrans: {
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 140,
    backgroundColor: "#fff",
    color: "#000",
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
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  actionButtonText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
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
});
