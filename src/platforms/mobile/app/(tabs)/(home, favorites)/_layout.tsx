import { Stack } from "expo-router";
import { useMemo } from "react";

const Layout = ({ segment }: { segment: string }) => {
  const rootScreen = useMemo(() => {
    switch (segment) {
      case "(home)":
      default:
        return <Stack.Screen name="index" options={{ headerShown: false }} />;
      case "(favorites)":
        return (
          <Stack.Screen name="favorites" options={{ headerShown: false }} />
        );
    }
  }, [segment]);

  return (
    <Stack>
      {rootScreen}
      <Stack.Screen name="country/[code]" options={{ headerShown: false }} />
      <Stack.Screen name="league/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="cup/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="match/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="team/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="player/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
