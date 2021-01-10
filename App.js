import "react-native-gesture-handler";
import React from "react";
import { LogBox } from "react-native";
// console.disableYellowBox = true;
LogBox.ignoreAllLogs(true);
import Userpseudo from "./reducers/pseudo";
import Interets from "./reducers/interet";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import HomeScreen from "./screens/homescreen";
import MapScreen from "./screens/mapscreen";
import ChatScreen from "./screens/chatscreen";
import InterestScreen from "./screens/interetscreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(combineReducers({ Userpseudo, Interets }));

const PagesTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = "ios-compass";
          } else if (route.name === "Chat") {
            iconName = "ios-chatbox";
          } else if (route.name === "POI") {
            iconName = "ios-list";
          }
          return <Ionicons name={iconName} size={34} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#eb4d4b",
        inactiveTintColor: "#FFF",
        style: {
          backgroundColor: "#130f40",
          paddingVertical: 8,
        },
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="POI" component={InterestScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" headerMode="none">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={PagesTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
