import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {icons, images} from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import {Link} from "expo-router";

const signIn = () => {
    const [form, setForm] = React.useState({
        email: "",
        password: "",
    });

    const onSignInPress = async () => {
        console.log("Sign in");
    }

  return (
      <ScrollView className={"flex-1 bg-white"}>
          <View className={"flex-1 bg-white"}>
              <View>
                  <Image source={images.signUpCar} className={"z-0 w-full h-[250px]"}/>
                  <Text className={"text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5"}>
                      Welcome 🙌
                  </Text>
              </View>
              <View className={"p-5"}>
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
                  <CustomButton title={"Sign in"} onPress={onSignInPress} className={"mt-6"} />

                  <OAuth />
                  <Link href={"/sign-up"} className={"text-lg text-center text-general-200 mt-3"}>
                      <Text>Don't have an account?</Text>
                      <Text className={"text-primary-500"}> SignUp</Text>
                  </Link>
              </View>
          </View>
      </ScrollView>
  );
};

export default signIn;
