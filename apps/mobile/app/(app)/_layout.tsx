import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          borderTopColor: '#f0f0f0',
          backgroundColor: '#fff',
          height: 64,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
      />
      <Tabs.Screen
        name="shlokas"
        options={{ title: 'Shlokas', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📿</Text> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
      />
      {/* Hide the story detail route from the tab bar */}
      <Tabs.Screen name="story/[id]" options={{ href: null }} />
    </Tabs>
  )
}
