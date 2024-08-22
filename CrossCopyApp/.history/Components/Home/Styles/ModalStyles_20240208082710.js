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
    height: 180,
    backgroundColor: "#373636e2",
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

    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    paddingVertical: 8
  },
  divider: {
    display: 'flex',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#6e6e6ee2',
  },
  modalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  }
  // Your existing styles...
});
