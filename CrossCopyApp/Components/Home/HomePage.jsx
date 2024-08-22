import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import SplashScreen from "../Auth/SplashScreen";
import TextSection from "./TextSection";
import History from "./History";
import Settings from "./Settings";
import Files from "../Files/Files";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FileModal from "../Files/FileModal";

import { useFetchData } from "../Files/Hooks/useFetchData";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabNavigator({
  text,
  files,
  paidUser,
  history,
  setText,
  setFiles,
  setHistory,
  ...rest
}) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#2c2c2c" }}
      edges={["top"]}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            borderTopWidth: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            // elevation: 10,
            // backgroundColor: '#fff',
            //   backgroundColor: colors.container,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            height: 80,
            // paddingBottom: 30,
            // paddingBottom: Platform.OS == "ios" ? 30 : 15,
            shadowOffset: { width: 2, height: 2 },
            //   shadowColor: colors.shadowColor,
            shadowOpacity: 0.6,
            elevation: 3,
          },
        }}
      >
        <Tab.Screen
          name="Files"
          children={() => (
            <Files files={files} setFiles={setFiles} paidUser={paidUser} />
          )}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="folder" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Text"
          children={() => <TextSection text={text} setText={setText} />}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="edit" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          children={() => <History history={history} setHistory={setHistory} />}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="list" size={20} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          children={() => <Settings paidUser={paidUser} />}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="settings" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function Homepage() {
  const {
    loading,
    text,
    setText,
    files,
    setFiles,
    paidUser,
    history,
    setHistory,
  } = useFetchData();

  if (loading) {
    return <SplashScreen homePage={true} />;
  }

  return (
    <NavigationContainer theme={CustomDarkTheme}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Group>
          <Stack.Screen name="Main">
            {(props) => (
              <BottomTabNavigator
                {...props}
                text={text}
                setText={setText}
                files={files}
                setFiles={setFiles}
                history={history}
                setHistory={setHistory}
                paidUser={paidUser}
                screenOptions={{ headerShown: false }}
              />
            )}
          </Stack.Screen>
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="SharedModal" component={FileModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  signOutButton: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#af00f4",
    marginTop: 10,
  },
});

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#66ffff", // Customize as needed
    background: "#252525",
    card: "#333333",
    // Add or override any other colors
  },
};
