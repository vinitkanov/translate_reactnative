import { useRouter } from "expo-router";
import { ArrowLeft, Globe, Heart, Shield, Zap } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();

  const features = [
    {
      icon: <Globe size={24} color="#000" />,
      title: "Multi-Language Support",
      description:
        "Support for 10+ languages including English, Indonesian, Spanish, French, and more",
    },
    {
      icon: <Zap size={24} color="#000" />,
      title: "Real-time Translation",
      description:
        "Fast and accurate translations powered by LibreTranslate API",
    },
    {
      icon: <Shield size={24} color="#000" />,
      title: "Privacy First",
      description: "All translations are stored locally on your device",
    },
    {
      icon: <Heart size={24} color="#000" />,
      title: "Free & Open Source",
      description: "No hidden costs, no subscriptions, completely free to use",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>About</Text>

        <Text style={styles.description}>
          A simple, elegant translation app that helps you communicate across
          languages. Built with React Native and powered by open-source
          translation technology.
        </Text>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>{feature.icon}</View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.creditsSection}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <View style={styles.creditItem}>
            <Text style={styles.creditLabel}>Translation API</Text>
            <Text style={styles.creditValue}>LibreTranslate</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditLabel}>Icons</Text>
            <Text style={styles.creditValue}>Lucide React Native</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditLabel}>Framework</Text>
            <Text style={styles.creditValue}>React Native + Expo</Text>
          </View>
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
  backButton: {
    padding: 8,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 48,
    fontFamily: "serif",
    fontStyle: "italic",
    marginBottom: 24,
    color: "#000",
    fontWeight: "400",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#999",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  creditsSection: {
    marginBottom: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  creditItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  creditLabel: {
    fontSize: 15,
    color: "#666",
  },
  creditValue: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: "#ccc",
  },
});
