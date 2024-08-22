import { StyleSheet } from "react-native";

export const FileStyles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 70,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    padding: 8,
    borderColor: "#676767",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    color: "#dad9d9",
    padding: 8,
    fontSize: 15,
  },
  infoContainer: {
    display: "flex",
    flex: 1,
    alignItems: "flex-start",

    justifyContent: "center",
  },
  dataContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    // width: '95%',
    flexDirection: "row",
    backgroundColor: "#26b8c3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    // marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  iconContainer: {
    display: "flex",
    height: '100%',
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBottomContainer: {
    display: "flex",
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
  },
  modalCloseButton: {
    width: "90%",
    height: "100%",
    borderRadius: 4,
    borderWidth: 1,
  },

  addItemContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: '20%',

    padding: 8,
  },

  addItemButton: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#c6c6c6",
    borderRadius: 8,
    backgroundColor: "#303030",
  },
  addItemText: {
    fontSize: 14,
    color: "#c6c6c6",
    marginTop: 10,
  },

  progressBarContainer: {
    width: '100%',
    height: 2,
  }
});
