import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

import { icons } from "@/constants";


const TabIcon = ({
                     source,
                     focused,
                 }: {
    source: ImageSourcePropType;
    focused: boolean;
}) => (
    <View className={"top-2.5"}>
        <View
            style={{
                width: focused ? 48 : 40,   // Smaller width when focused
                height: focused ? 48 : 40,  // Smaller height when focused
                borderRadius: 24,
                backgroundColor: focused ? "#00C853" : "transparent",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Image
                source={source}
                resizeMode="contain"
                style={{
                    width: 24,
                    height: 24,
                    tintColor: "white",
                }}
            />
        </View>
    </View>
);





export default function Layout() {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#333333",
                    borderRadius: 50,
                    borderTopWidth: 0,
                    overflow: "hidden",
                    marginHorizontal: 20,
                    marginBottom: 23,
                    height: 78,
                    paddingBottom: 10, // Push icons up a bit
                    paddingTop: 10,    // Balance vertical spacing
                    flexDirection: "row",
                },

            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.home} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="rides"
                options={{
                    title: "Rides",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.list} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.chat} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.profile} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}
