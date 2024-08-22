import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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

  const handleDismissModalPress = () => {
    optionsRef.current?.dismiss();
    setIsSheetVisible(false);
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
    >
      <View style={styles.headingContainer}>
        <Text>{selectedFile.name}</Text>
      </View>
    </BottomSheetModal>
  );
};

export default OptionsSheet;

const Options = () => {
  return <View style={styles.subContainer}></View>;
};

const styles = StyleSheet.create({
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subContainer: { display: "flex", flex: 1, width: "100%" },
});
