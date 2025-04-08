import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
//import { SignOutButton } from '@/app/components/SignOutButton'

const home = () => {
    const { user } = useUser()

    return (
        <SafeAreaView>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                {/*<SignOutButton />*/}
            </SignedIn>
            <SignedOut>
                <Link href={"/(auth)/sign-in"}>
                    <Text>Sign in</Text>
                </Link>
                <Link href={"/(auth)/sign-up"}>
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
        </SafeAreaView>
    )
};

export default home;
