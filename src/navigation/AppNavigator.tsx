import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import FeedScreen from '../screens/FeedScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ConversationScreen from '../screens/ConversationScreen';
import StoriesScreen from '../screens/StoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostUploadScreen from '../screens/PostUploadScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Feed Stack Navigator
const FeedStack = () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedMain" component={FeedScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

// Chat Stack Navigator
const ChatStack = () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatsScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator id={undefined} initialRouteName="Chats"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Feed') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Chats') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Upload') {
              iconName = focused ? 'duplicate' : 'duplicate-outline';
            } else if (route.name === 'Stories') {
              iconName = focused ? 'bonfire' : 'bonfire-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.muted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Chats" component={ChatStack} />
        <Tab.Screen name="Upload" component={PostUploadScreen} />
        <Tab.Screen name="Stories" component={StoriesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    height: 75,
    ...theme.shadows.sm,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default AppNavigator;