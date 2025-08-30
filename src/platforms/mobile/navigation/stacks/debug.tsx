import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DebugScreen } from "@/screens/DebugScreen";
import { useTheme } from "@/core/context/ThemeContext";
import { DebugStackParamList } from "@/core/types/navigation";

const Stack = createStackNavigator<DebugStackParamList>();

export const DebugStackNavigator: React.FC = () => {
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
