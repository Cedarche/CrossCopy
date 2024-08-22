import { StyleSheet } from "react-native";

export const ModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: 225,
    height: 150,
    backgroundColor: "#5d5d5d",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Position absolutely to place it based on touch coordinates
    borderRadius: 10, // Optional, for rounded corners
    shadowOffset: { width: 2, height: 2 },
    //   shadowColor: colors.shadowColor,
    shadowOpacity: 0.6,
    elevation: 3,
  },
  modalRow: {
    display: 'flex',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  modalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  }
  // Your existing styles...
});
