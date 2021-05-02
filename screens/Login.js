import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import {icons, images, FONTS, COLORS, SIZES} from "../constants";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';


const setLoginLocal = async (user) => {
    try {

        const data = await firestore()
            .collection('Users')
            .doc(user.uid)
            .get();

        const userModel = {
            userid: user.uid,
            email: user.email,
            phone: data.get('phone'),
            fullname: data.get('fullname'),
            money: data.get('money')
        }
            
        console.log(userModel.userid);
        await AsyncStorage.setItem("@UserData", JSON.stringify(userModel));

    } catch (err) {
        console.log(err);
    }
}

const Login = ({navigation}) => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = React.useState(false);

    function signIn(email, password) {
        if(email != null || password != null) {
            auth().signOut();
            auth().signInWithEmailAndPassword(email, password).then(() => {
                const user = auth().currentUser;
                setLoginLocal(user);
                navigation.navigate("Home");
            }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }
        
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
        
                console.error(error);
            });
        } else {
            //console.log("Null email and password");
        }
        
    }

    function renderButton() {
        return (
            <View style={{margin: SIZES.padding * 3}}>
                <TouchableOpacity 
                    style= {{
                        height: 60,
                        backgroundColor: COLORS.black,
                        borderRadius: SIZES.radius/1.5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress = {() => signIn(email, password) }
                >
                    <Text style = {{ color: COLORS.white, ...FONTS.h3 }}>Sign In</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function renderForgotPasswordButton() {
        return (
            <View style={{marginLeft: SIZES.padding * 3, marginRight: SIZES.padding * 3}}>
                <Text 
                    style={{
                        color: COLORS.white,
                        fontSize: 14,
                        textAlign: "right"
                    }}
                    onPress={()=>console.log("User press forgot password")}
                >I forgot my password!</Text>
            </View>
        )
    }

    function renderINeedMyAccount() {
        return (
            <View style={{margin: SIZES.padding * 3}}>
                <Text 
                    style={{
                        color: COLORS.white,
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                    onPress={()=> navigation.navigate("SignUp")}
                >I NEED AN ACCOUNT</Text>
            </View>
        )
    }

    function renderLogo() {
        return (
            <View
                style = {{
                     marginTop: SIZES.padding * 5,
                     height: 100,
                     alignItems: 'center',
                     justifyContent: 'center'
                }}
                >

                <Image
                    source = {images.wallieLogo}
                    resizeMode = "contain"
                    style = {{
                        width: "60%"
                    }}
                />

            </View>
        );
    }

    function renderForm() {
        return (
            <View
                style = {{
                    marginTop: SIZES.padding * 3,
                    marginHorizontal: SIZES.padding * 3
                }}
            >
                <View style = {{marginTop: SIZES.padding * 2}}>
                    <Text style = {{color: COLORS.lightGreen, ...FONTS.body3}}>
                            Username/Email:
                    </Text>
                    <TextInput
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.white,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                        placeholder = "Enter email"
                        placeholderTextColor = {COLORS.white}
                        selectionColor = {COLORS.white}
                        onChangeText = {email => setEmail(email)}
                    />
                </View>
                
                <View style = {{marginTop: SIZES.padding * 2}}>
                    <Text style = {{color: COLORS.lightGreen, ...FONTS.body3}}>
                            Password
                    </Text>
                    <TextInput
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.white,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                        placeholder = "Enter password"
                        placeholderTextColor = {COLORS.white}
                        selectionColor = {COLORS.white}
                        secureTextEntry = {!showPassword}
                        onChangeText = {password => setPassword(password)}
                    />
                    <TouchableOpacity
                        style = {{
                            position: 'absolute',
                            right: 0,
                            bottom: 10,
                            height: 30,
                            width: 30,
                        }}
                        onPress = {()=> setShowPassword(!showPassword)}
                    >
                    <Image
                        source = {showPassword ? icons.disable_eye : icons.eye}
                        style = {{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.white
                        }}
                    />

                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior = {Platform.OS === "ios" ? "padding" : null}
            style={{flex: 1}}
        >
            <LinearGradient
                colors={[COLORS.lime, COLORS.emerald]}
                style={{flex: 1}}
            >
                <ScrollView>
                    {renderLogo()}
                    {renderForm()}
                    {renderForgotPasswordButton()}
                    {renderButton()}
                    {renderINeedMyAccount()}
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

export default Login;