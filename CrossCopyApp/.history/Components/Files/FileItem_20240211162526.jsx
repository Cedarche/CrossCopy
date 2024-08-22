import React, { useEffect, useState, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import { FileStyles } from "./FileStyles";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const strTime =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "/" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    ", " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    ampm;
  return strTime;
};

function truncateFileName(fileName) {
  // Split the file name into name and extension
  const splitName = fileName.split("_");
  const extension = splitName.pop();
  let name = splitName.join(".");

  // If the name is longer than 30 characters, truncate it
  if (name.length > 20) {
    name = `${name.substring(0, 18)}(...)`;
  }

  // Return the truncated name with the extension
  return `${name}.${extension}`;
}

export const FileItem = ({
  file,
  openSheet,
  openOptions,
  handleRemoveFile,
}) => {
  const icon = file.name.endsWith("jpg" || "png" || "svg") ? "image" : "file";

  return (
    <View style={FileStyles.itemContainer}>
      <TouchableOpacity
        style={FileStyles.iconContainer}
        onLongPress={() => openSheet(file)}
      >
        {file?.name.endsWith("pdf") ? (
          <AntDesign
            name="pdffile1"
            color={"#c7c7c7"}
            size={25}
            style={{ marginRight: 8 }}
          />
        ) : (
          <Feather
            name={icon}
            color={"#c7c7c7"}
            size={25}
            style={{ marginRight: 8 }}
          />
        )}

        <View style={FileStyles.infoContainer}>
          <Text style={{ color: "#dedede" }}>
            {truncateFileName(file.name)}
          </Text>
          <View style={FileStyles.dataContainer}>
            <Text
              style={{
                fontSize: 10,
                marginRight: 4,
                fontWeight: 400,
                color: "lightblue",
              }}
            >
              {file.size / 1000 < 1000
                ? (file.size / 1000).toFixed(2) + "KB"
                : (file.size / 1000000).toFixed(2) + "MB"}
            </Text>
            <Text style={{ color: "#898989" }}>|</Text>
            <Text
              style={{
                fontSize: 10,
                marginLeft: 4,
                fontWeight: 300,
                color: "#00f7ff",
              }}
            >
              {formatTimestamp(file.uploadTimestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          openOptions(file);
        }}
      >
        <Feather name="more-vertical" size={25} color={"#727272"} />
      </TouchableOpacity>
    </View>
  );
};
