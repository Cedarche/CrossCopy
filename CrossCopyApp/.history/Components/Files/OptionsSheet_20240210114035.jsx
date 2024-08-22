import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

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
  const [index, setIndex] = useState(0);
  const optionsRef = useRef(null);
  const snapPoints = useMemo(() => ["40%", "60%"], []);
  const icon = selectedFile?.name.endsWith("jpg" || "png" || "svg")
    ? "image"
    : "file";

  const handleDismissModalPress = () => {
    optionsRef.current?.dismiss();
    setIndex(0);
    setOptionsVisible(false);
  };
  const handleSheetChanges = useCallback((index) => {}, []);

  useEffect(() => {
    if (isOptionsVisible && selectedFile) {
      optionsRef.current?.present();
    } else {
      optionsRef.current?.dismiss();
    }
  }, [isOptionsVisible, selectedFile]);

  const handleShare = () => {
    setIndex(1);
  };

  return (
    <BottomSheetModal
      ref={optionsRef}
      index={index}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) {
          setIndex(0);
          setOptionsVisible(false);
        }
      }}
      style={{ zIndex: 10 }}
      backgroundComponent={CustomBackgroundComponent}
      handleStyle={{ display: "none" }}
      onClose={() => setIndex(0)}
    >
      <View style={styles.headingContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name={icon} color={"#fff"} size={20} />
          <Text style={{ color: "#fff", marginLeft: 8 }}>
            {selectedFile?.name}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDismissModalPress}>
          <Feather name="x" color={"#fff"} size={22} />
        </TouchableOpacity>
      </View>
      {index === 0 ? <Options handleShare={handleShare} /> : <ShareOptions />}
    </BottomSheetModal>
  );
};

export default OptionsSheet;

const Options = ({ handleShare }) => {
  return (
    <View style={styles.subContainer}>
      <TouchableOpacity
        style={[styles.optionRow, { marginTop: 8 }]}
        onPress={handleShare}
      >
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

const ShareOptions = () => {
  return (
    <View
      style={[styles.shareSubContainer]}
    >
      <View style={styles.QRcontainer}>
        <QRCode
          value="http://crosscopy.dev"
          size={200}
          color="#fff"
          backgroundColor="#383838"
        />
        <Text style={{ fontSize: 16, color: "#fff", marginTop: 10 }}>
          Scan QR code or tap to share natively
        </Text>
      </View>
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
  shareSubContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 15,
  },
  QRcontainer: {
    flex: 1,
    width: "80%",
    maxHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#26b8c3",
    borderRadius: 12,
  },
});
