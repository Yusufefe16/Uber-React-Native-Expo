import React, {useState} from 'react';
import {View, Text, ScrollView, Image, Alert} from 'react-native';
import {icons, images} from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import {Link, useRouter} from "expo-router";
import OAuth from "@/components/OAuth";
import {useSignUp} from "@clerk/clerk-expo";
import {ReactNativeModal} from "react-native-modal";

const signUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [showStateModal, setShowStateModal] = useState(false)

    const [form, setForm] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    const [verification, setVerification] = useState({
        state: 'default',
        error: '',
        code: ''
    })

    const onSignUpPress = async () => {
        if (!isLoaded) return;

        // Start sign-up process using email and password provided
        try {
            await signUp!.create({
                emailAddress: form.email,
                password: form.password,
            })

            // Send user an email with verification code
            await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setVerification({
                ...verification,
                state: 'pending'
            })
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert("Error", err.errors[0].longMessage)
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp!.attemptEmailAddressVerification({
                code: verification.code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                //TODO Create a database user!
                if (setActive) {
                    await setActive({session: signUpAttempt.createdSessionId})
                    setVerification({
                        ...verification,
                        state: 'success'
                    });
                }

            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                setVerification({
                    ...verification,
                    state: 'error',
                    error: "Verification failed."
                })
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            setVerification({
                ...verification,
                state: 'error',
                error: err.errors[0].longMessage
            })
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <ScrollView className={"flex-1 bg-white"}>
            <View className={"flex-1 bg-white"}>
                <View>
                    <Image source={images.signUpCar} className={"z-0 w-full h-[250px]"}/>
                    <Text className={"text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5"}>
                        Create Your Account
                    </Text>
                </View>
                <View className={"p-5"}>
                    <InputField
                        label={"Name"}
                        placeholder={"Enter your name"}
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value)=> setForm({...form, name: value})}
                        labelStyle={""}
                    />
                    <InputField
                        label={"Email"}
                        placeholder={"Enter your email"}
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value)=> setForm({...form, email: value})}
                        labelStyle={""}
                    />
                    <InputField
                        label={"Password"}
                        placeholder={"Enter your password"}
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value)=> setForm({...form, password: value})}
                        labelStyle={""}
                    />
                    <CustomButton title={"Sign up"} onPress={onSignUpPress} className={"mt-6"} />

                    <OAuth />
                    <Link href={"/sign-in"} className={"text-lg text-center text-general-200 mt-3"}>
                        <Text>Already have an account?</Text>
                        <Text className={"text-primary-500"}> Log in</Text>
                    </Link>
                </View>
            </View>
            <ReactNativeModal
                isVisible={verification.state === 'pending'}
                onModalHide={()=> {
                    if (verification.state === 'success')setShowStateModal(true)
                }}

            >
                <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
                    <Text className={"text-2xl font-JakartaExtraBold mb-2"}>
                        Verification
                    </Text>
                    <Text className={"font-Jakarta  mb-5"}>
                        We sent a verification code to your email. Please enter it below.
                    </Text>
                    <InputField
                        label={"Code"}
                        icon={icons.lock}
                        placeholder={"12345"}
                        value={verification.code}
                        keyboardType={"numeric"}
                        onChangeText={(value)=> setVerification({...verification, code: value})}
                        />
                    {verification.error &&
                        (<Text className={"text-red-500 text-sm mt-1"}>{verification.error}</Text>)
                    }

                    <CustomButton title={"Verify Email"} onPress={onVerifyPress} className={"mt-5 bg-success-500"} />
                </View>
            </ReactNativeModal>

            <ReactNativeModal isVisible={showStateModal}>
                <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
                    <Image source={images.check} className={"w-[110px] h-[110px] mx-auto my-5"} />
                    <Text className={"text-3xl font-JakartaBold text-center"}>
                        Verified
                    </Text>
                    <Text className={"text-base text-gray-400 font-JakartaBold  text-center mt-2"}>
                        You have succesfully verified your account
                    </Text>
                    <CustomButton
                        title={"Browse Home"}
                        onPress={()=> {
                            setShowStateModal(false)
                            router.push('/(root)/(tabs)/home')
                        }}
                        className={"mt-5"}
                    />
                </View>
            </ReactNativeModal>
        </ScrollView>
    );
};

export default signUp;
