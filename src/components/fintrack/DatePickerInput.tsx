import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Icon from "@/components/fintrack/Icon";
import { parseYMD, formatYMD, formatDateFull } from "@/utils/date";

interface DatePickerInputProps {
  value: string; // YYYY-MM-DD
  onChange: (newDate: string) => void;
  label?: string;
}

export default function DatePickerInput({
  value,
  onChange,
  label = "Tanggal Transaksi",
}: DatePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const currentDateObj = parseYMD(value);

  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      onChange(formatYMD(selectedDate));
    }
  };

  const handleIOSChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      onChange(formatYMD(selectedDate));
    }
  };

  const formattedDisplayDate = value ? formatDateFull(value) : "Pilih Tanggal";

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={styles.inputButton}
        activeOpacity={0.7}
        onPress={() => setShowPicker(true)}
      >
        <View style={{ marginRight: 8 }}>
          <Icon name="calendar" size={16} color="#64748B" />
        </View>
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateYmdText}>{value || "YYYY-MM-DD"}</Text>
          <Text style={styles.dateFormattedText}>{formattedDisplayDate}</Text>
        </View>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={currentDateObj}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {showPicker && Platform.OS === "ios" && (
        <Modal
          transparent
          animationType="fade"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pilih Tanggal</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalDoneText}>Selesai</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={currentDateObj}
                mode="date"
                display="spinner"
                onChange={handleIOSChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 14,
  },
  inputButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  calendarIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateYmdText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  dateFormattedText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  arrowIcon: {
    fontSize: 11,
    color: "#94A3B8",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalDoneText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F97316",
  },
});
