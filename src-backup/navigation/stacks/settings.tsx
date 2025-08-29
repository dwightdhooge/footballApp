import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "@/screens/settings";
import { useTheme } from "@/context/ThemeContext";
import { SettingsStackParamList } from "@/types/navigation";

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          title: "Instellingen",
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
