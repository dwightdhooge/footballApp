import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DebugScreen from "@/screens/debug";
import { useTheme } from "@/context/ThemeContext";
import { DebugStackParamList } from "@/types/navigation";

const Stack = createStackNavigator<DebugStackParamList>();

const DebugStackNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
      }}
    >
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          title: "Debug",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default DebugStackNavigator;
