import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {icons, images} from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import {Link} from "expo-router";
import OAuth from "@/components/OAuth";

const signUp = () => {
    const [form, setForm] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    const onSignUpPress = async () => {
        console.log("Sign up");
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
        </ScrollView>
    );
};

export default signUp;
