/**
 * File: SubjectManager.tsx
 * Description: Allows users to add and remove subjects for task categorization.
 * Includes modal interface with input, list of subjects as chips, and support for animation.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSubject, deleteSubject } from "@/features/settings/settingsSlice";

// ✅ Enable LayoutAnimation on Android (iOS is supported by default)
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─────────────────────────────────────────────
// 🔸 Component: SubjectManager
// ─────────────────────────────────────────────

/**
 * Renders the SubjectManager UI, allowing users to view, add, and delete subjects.
 * Data is managed through Redux and animations are applied to state changes.
 */
export default function SubjectManager() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((s) => s.settings.subjects);

  const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility
  const [newSubject, setNewSubject] = useState(""); // Stores user input

  /**
   * Adds a new subject to the store if valid and non-duplicate.
   * Triggers animated transition.
   */
  const handleAdd = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch(addSubject(trimmed));
      setNewSubject("");
    }
  };

  /**
   * Deletes a subject from the store with animation.
   * @param item - Subject to delete
   */
  const handleDelete = (item: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(deleteSubject(item));
  };

  /**
   * Renders the modal dialog for managing subjects.
   * Includes subject chips and a new subject input row.
   */
  const renderModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableBackdrop onPress={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Manage Subjects
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color={theme.tertiaryText} />
              </Pressable>
            </View>

            {/* List of Subjects as Chips */}
            <FlatList
              data={subjects}
              keyExtractor={(i) => i}
              numColumns={2}
              contentContainerStyle={styles.chipList}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.overlay,
                      shadowColor: theme.shadow,
                    },
                  ]}
                >
                  <Text
                    style={[styles.chipText, { color: theme.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item}
                  </Text>
                  <Pressable
                    onPress={() => handleDelete(item)}
                    hitSlop={8}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={14} color={theme.tertiaryText} />
                  </Pressable>
                </View>
              )}
            />

            {/* Input for Adding New Subject */}
            <View
              style={[
                styles.addRow,
                {
                  borderColor: theme.overlay,
                  backgroundColor: theme.inputBackground,
                },
              ]}
            >
              <TextInput
                value={newSubject}
                onChangeText={setNewSubject}
                placeholder="New subject"
                placeholderTextColor={theme.tertiaryText}
                style={[styles.addInput, { color: theme.text }]}
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
              <Pressable
                onPress={handleAdd}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableBackdrop>
    </Modal>
  );

  return (
    <>
      {/* Row in Settings List */}
      <View style={styles.container}>
        <View style={styles.labelRow}>
          <Ionicons name="book-outline" size={18} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Subjects</Text>
        </View>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
        </Pressable>
      </View>

      {renderModal()}
    </>
  );
}

// ─────────────────────────────────────────────
// 🔸 TouchableBackdrop Component
// ─────────────────────────────────────────────

/**
 * Transparent clickable backdrop for modal.
 * Closes modal on outside press.
 */
type BackdropProps = {
  children: React.ReactNode;
  onPress: () => void;
};

function TouchableBackdrop({ children, onPress }: BackdropProps) {
  return (
    <Pressable style={styles.backdrop} onPress={onPress}>
      {children}
    </Pressable>
  );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // Settings Row
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconButton: {
    padding: 4,
  },
  pressed: {
    opacity: 0.6,
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  // Chip list
  chipList: {
    paddingBottom: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    margin: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: 100,
  },
  closeBtn: {
    marginLeft: 4,
    padding: 2,
  },

  // Add subject input row
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  addInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  addBtn: {
    padding: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
});