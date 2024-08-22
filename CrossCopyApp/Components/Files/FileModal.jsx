import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import PDFPlaceholder from "../../assets/PDF_placeholder2.png";
import * as FileSystem from "expo-file-system";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const itemWidth = screenWidth / numColumns - 20;

export default function FileModal({ route, navigation }) {
  const [filesWithSize, setFilesWithSize] = useState([]);
  const previousFilesRef = useRef([]); 

  const { files } = route.params || [];

  const fileDisplayName = files[0]?.fileName.split("-")[0];
  const extension = files[0]?.extension.toLowerCase();

  useEffect(() => {
    const addFileSize = async (files) => {
      const filesWithSize = await Promise.all(
        files.map(async (file) => {
          const fileInfo = await FileSystem.getInfoAsync(file.filePath);
          const shortenedFileName =
            file.fileName.split("-")[0] + "." + file.extension.toLowerCase();
          return {
            ...file,
            fileSize: fileInfo.size,
            fileName: shortenedFileName,
          };
        })
      );
      setFilesWithSize(filesWithSize);
    };

    // Only run the effect if the files array has changed
    if (JSON.stringify(previousFilesRef.current) !== JSON.stringify(files)) {
      previousFilesRef.current = files;
      addFileSize(files);
    }
  }, [files]);

  const isImage = (fileName) => {
    return (
      fileName.toLowerCase().endsWith("jpg") ||
      fileName.toLowerCase().endsWith("jpeg") ||
      fileName.toLowerCase().endsWith("png") ||
      fileName.toLowerCase().endsWith("svg")
    );
  };

  const isPDF = (fileName) => {
    return fileName.toLowerCase().endsWith("pdf");
  };

  const icon = isImage(files[0]?.fileName)
    ? "image"
    : isPDF(file?.fileName)
    ? "file-text"
    : "file";

  const renderFileItem = ({ item }) => {
    const fileDisplayName = item?.fileName.split("-")[0];
    const extension = item?.extension.toLowerCase();
    const icon = isImage(item?.fileName)
      ? "image"
      : isPDF(item?.fileName)
      ? "file-text"
      : "file";

    return (
      <View style={styles.fileItemContainer}>
        {isImage(item.fileName) ? (
          <Image
            source={{ uri: item.filePath }}
            style={styles.gridImage}
            resizeMode="contain"
          />
        ) : isPDF(item.fileName) ? (
          <Image
            source={PDFPlaceholder}
            style={styles.gridImage}
            resizeMode="contain"
          />
        ) : (
          <Entypo name="documents" size={100} color="black" />
        )}
        <Text style={styles.fileNameText}>
          {fileDisplayName + "." + extension}
        </Text>
      </View>
    );
  };

  const handleUpload = () => {
    navigation.navigate("Files", { filesToUpload: filesWithSize });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        {files?.length > 1 ? (
          <Text style={styles.headingText}>Shared Files</Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name={icon} color={"#fff"} size={20} />
            <Text style={{ color: "#fff", marginLeft: 8 }}>
              {fileDisplayName + "." + extension}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" color={"#fff"} size={22} />
        </TouchableOpacity>
      </View>
      {files?.length > 1 ? (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: files[0].filePath }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.subContainer}>
        <TouchableOpacity
          style={[styles.optionRow, { marginTop: 8 }]}
          onPress={handleUpload}
        >
          <Feather name="upload" color={"#26b8c3"} size={22} />
          <Text style={{ color: "#26b8c3" }}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.goBack()}
        >
          <Feather name="delete" color={"#f63c3c"} size={22} />
          <Text style={{ color: "#f63c3c" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252525",
  },
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
  headingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  gridContainer: {
    alignItems: "center",
    padding: 10,
  },
  fileItemContainer: {
    alignItems: "center",
    margin: 5,
    width: itemWidth,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#676767",
    borderRadius: 8,
  },
  gridImage: {
    width: "100%",
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  fileNameText: {
    color: "#fff",
    textAlign: "center",
  },
  subContainer: {
    display: "flex",
    width: "100%",
    marginBottom: 40,
  },
  image: {
    width: 500,
    height: "95%",
    marginVertical: 20,
    borderRadius: 20,
  },
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
  },
});
