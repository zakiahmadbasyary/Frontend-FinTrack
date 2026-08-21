import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { getMonthYearName, MONTH_NAMES_ID } from "@/utils/date";
import Icon from "@/components/fintrack/Icon";

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number; // 0 - 11
  onChangeMonth: (year: number, month: number) => void;
}

export default function MonthSelector({
  selectedYear,
  selectedMonth,
  onChangeMonth,
}: MonthSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(selectedYear);

  const now = new Date();
  const currentActualYear = now.getFullYear();
  const currentActualMonth = now.getMonth();

  const isCurrentMonthSelected =
    selectedYear === currentActualYear && selectedMonth === currentActualMonth;

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onChangeMonth(selectedYear - 1, 11);
    } else {
      onChangeMonth(selectedYear, selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onChangeMonth(selectedYear + 1, 0);
    } else {
      onChangeMonth(selectedYear, selectedMonth + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    onChangeMonth(currentActualYear, currentActualMonth);
    setPickerYear(currentActualYear);
  };

  const openPickerModal = () => {
    setPickerYear(selectedYear);
    setModalVisible(true);
  };

  const handleSelectMonthInModal = (monthIdx: number) => {
    onChangeMonth(pickerYear, monthIdx);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorBar}>
        <TouchableOpacity
          style={styles.arrowButton}
          activeOpacity={0.7}
          onPress={handlePrevMonth}
        >
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.monthDisplayButton}
          activeOpacity={0.8}
          onPress={openPickerModal}
        >
          <View style={{ marginRight: 6 }}>
            <Icon name="calendar" size={16} color="#F97316" />
          </View>
          <Text style={styles.monthDisplayText}>
            {getMonthYearName(selectedYear, selectedMonth)}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrowButton}
          activeOpacity={0.7}
          onPress={handleNextMonth}
        >
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {!isCurrentMonthSelected && (
        <View style={styles.resetContainer}>
          <TouchableOpacity
            style={styles.resetBadge}
            activeOpacity={0.8}
            onPress={handleResetToCurrentMonth}
          >
            <Text style={styles.resetBadgeText}>↺ Kembali ke Bulan Ini</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Picker Bulan & Tahun */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Bulan & Tahun</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Selector Tahun */}
            <View style={styles.yearPickerRow}>
              <TouchableOpacity
                style={styles.yearArrowBtn}
                onPress={() => setPickerYear(pickerYear - 1)}
              >
                <Text style={styles.yearArrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.yearTitleText}>{pickerYear}</Text>
              <TouchableOpacity
                style={styles.yearArrowBtn}
                onPress={() => setPickerYear(pickerYear + 1)}
              >
                <Text style={styles.yearArrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Grid 12 Bulan */}
            <View style={styles.monthsGrid}>
              {MONTH_NAMES_ID.map((monthName, idx) => {
                const isSelected =
                  selectedYear === pickerYear && selectedMonth === idx;
                const isThisMonth =
                  currentActualYear === pickerYear && currentActualMonth === idx;

                return (
                  <TouchableOpacity
                    key={monthName}
                    style={[
                      styles.monthGridItem,
                      isSelected && styles.monthGridItemSelected,
                      isThisMonth && !isSelected && styles.monthGridItemCurrent,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleSelectMonthInModal(idx)}
                  >
                    <Text
                      style={[
                        styles.monthGridText,
                        isSelected && styles.monthGridTextSelected,
                        isThisMonth && !isSelected && styles.monthGridTextCurrent,
                      ]}
                    >
                      {monthName.substring(0, 3)}
                    </Text>
                    {isThisMonth && !isSelected && (
                      <View style={styles.currentMonthDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalDoneButton}
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalDoneButtonText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  selectorBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#334155",
    marginTop: -2,
  },
  monthDisplayButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#FFF7ED",
  },
  calendarEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  monthDisplayText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F97316",
    marginRight: 6,
  },
  dropdownIcon: {
    fontSize: 10,
    color: "#F97316",
  },
  resetContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  resetBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  resetBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#94A3B8",
    padding: 4,
  },
  yearPickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  yearArrowBtn: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  yearArrowText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F97316",
  },
  yearTitleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginHorizontal: 16,
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthGridItem: {
    width: "30%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  monthGridItemSelected: {
    backgroundColor: "#F97316",
  },
  monthGridItemCurrent: {
    borderWidth: 1.5,
    borderColor: "#F97316",
    backgroundColor: "#FFF7ED",
  },
  monthGridText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  monthGridTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  monthGridTextCurrent: {
    color: "#F97316",
    fontWeight: "700",
  },
  currentMonthDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F97316",
    position: "absolute",
    bottom: 4,
  },
  modalDoneButton: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalDoneButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
});
