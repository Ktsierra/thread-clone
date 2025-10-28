import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useState } from "react";

const TAB_LABELS = ["Threads", "Replies", "Repost"] as const;
type TabLabel = (typeof TAB_LABELS)[number];

interface TabsProps {
  onTabsChange: (tab: TabLabel) => void;
}

const Tabs = ({ onTabsChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<TabLabel>("Threads");

  const handlePressTab = (tab: TabLabel) => {
    setActiveTab(tab);
    onTabsChange(tab);
  };
  return (
    <View style={styles.container}>
      {TAB_LABELS.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => handlePressTab(tab)}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  activeTab: {
    borderBottomColor: Colors.black,
  },
  activeTabText: {
    color: Colors.black,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
  },
  tab: {
    alignItems: "center",
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  tabText: {
    color: Colors.border,
  },
});
