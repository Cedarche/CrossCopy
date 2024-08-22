import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";

const CustomBackgroundComponent = ({ style }) => {
  return (
    <View
      style={[
        style,
        {
          backgroundColor: "#383838",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
      ]}
    />
  );
};

const OptionsSheet = ({
  isOptionsVisible,
  setOptionsVisible,
  selectedFile,
}) => {
  const optionsRef = useRef(null);
  const snapPoints = useMemo(() => ["40%", "70%"], []);
  const icon = selectedFile.name.endsWith("jpg" || "png" || "svg")
    ? "image"
    : "file";

  const handleDismissModalPress = () => {
    optionsRef.current?.dismiss();
    setOptionsVisible(false);
  };

  useEffect(() => {
    if (isOptionsVisible && selectedFile) {
      optionsRef.current?.present();
    } else {
      optionsRef.current?.dismiss();
    }
  }, [isOptionsVisible, selectedFile]);

  return (
    <BottomSheetModal
      ref={optionsRef}
      index={1}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) {
          setOptionsVisible(false);
        }
      }}
      style={{ zIndex: 10 }}
      backgroundComponent={CustomBackgroundComponent}
      handleStyle={{  maxHeight: 10,}}
    >
      <View style={styles.headingContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name={icon} color={"#fff"} size={20} />
          <Text style={{ color: "#fff", marginLeft: 8 }}>
            {selectedFile.name}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDismissModalPress}>
          <Feather name="x" color={"#fff"} size={22} />
        </TouchableOpacity>
      </View>
      <Options />
    </BottomSheetModal>
  );
};

export default OptionsSheet;

const Options = () => {
  return (
    <View style={styles.subContainer}>
      <TouchableOpacity style={[styles.optionRow, { marginTop: 8 }]}>
        <Feather name="share" color={"#26b8c3"} size={22} />
        <Text style={{ color: "#26b8c3" }}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow}>
        <Feather name="download" color={"#26b8c3"} size={22} />
        <Text style={{ color: "#26b8c3" }}>Download</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow}>
        <Feather name="delete" color={"#f63c3c"} size={22} />
        <Text style={{ color: "#f63c3c" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#515151",
  },
  subContainer: { display: "flex", flex: 1, width: "100%" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#676767",
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
    shadowColor: "#676767",
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    
    elevation: 21,
  },
  divider: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});
