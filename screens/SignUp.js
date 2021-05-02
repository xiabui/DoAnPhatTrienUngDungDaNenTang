import React, {useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS, SIZES, icons, images} from "../constants"

const SignUp = ({navigation}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [fullname, setFullname] = useState();
    const [phone, setPhone] = useState();
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [modalVisiable, setModalVisiable] = useState(false);

    function signUp(email, password, fullname, phone) {
        if(email != null && password != null && fullname != null && phone != null){
            auth().createUserWithEmailAndPassword(email, password).then(() => {
                firestore().collection('Users').doc(phone).set({'fullname': fullname, 'email': email, 'money': 0}).then(() => {
                    navigation.navigate("Login");
                }).catch(error => {
                    console.log(error.code);
                });
            }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is used!');
                }
        
                if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                }
        
                console.error(error);
            });
        }
    }

    function renderHeader(){
        return(
            <TouchableOpacity 
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: SIZES.padding,
                paddingHorizontal: SIZES.padding * 2,
                }}
                onPress={() =>navigation.navigate("Login")}
            >
                <Image
                    source ={icons.back}
                    resizeMode="contain"
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.white
                    }}
                />
                <Text style={{
                    marginLeft: SIZES.padding * 1.5,
                    color: COLORS.white,
                    ...FONTS.h4
                }}>Login</Text>
            </TouchableOpacity>
        );
    }

    function renderButton() {
        return (
            <View style= {{margin: SIZES.padding *3}} >
                <TouchableOpacity 
                    style = {{
                        height: 60,
                        backgroundColor: COLORS.black,
                        borderRadius: SIZES.radius / 1.5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => signUp(email, password, fullname, username) }
                >
                    <Text style={{color: COLORS.white, ...FONTS.h3}}> Submit </Text>
                </TouchableOpacity>
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
                {/*Full name*/}
                <View style = {{marginTop: SIZES.padding * 3}}>
                    <Text style = {{color:COLORS.lightGreen, ...FONTS.body3 }}>Full name</Text>
                    <TextInput 
                        style = {{
                            marginVertical: SIZES.padding,
                            borderBottomColor: COLORS.white,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                        placeholder = 'Enter full name'
                        placeholderTextColor = {COLORS.white}
                        selectionColor = {COLORS.white}
                        onChangeText = {fullname => setFullname(fullname)}
                    />
                </View>

                {/*Username*/}
                <View style = {{marginTop: SIZES.padding * 3}}>
                    <Text style = {{color:COLORS.lightGreen, ...FONTS.body3 }}>Username</Text>
                    <TextInput 
                        style = {{
                            marginVertical: SIZES.padding,
                            borderBottomColor: COLORS.white,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                        placeholder = 'Enter phone number'
                        placeholderTextColor = {COLORS.white}
                        selectionColor = {COLORS.white}
                        onChangeText = {phone => setPhone(phone)}
                    />
                </View>

                {/*Email*/}
                <View style = {{marginTop: SIZES.padding * 3}}>
                    <Text style = {{color:COLORS.lightGreen, ...FONTS.body3 }}>Email</Text>
                    <TextInput 
                        style = {{
                            marginVertical: SIZES.padding,
                            borderBottomColor: COLORS.white,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                        placeholder = 'Enter email'
                        placeholderTextColor = {COLORS.white}
                        selectionColor = {COLORS.white}
                        onChangeText = {email => setEmail(email)}
                    />
                </View>

                    
                {/*Password*/}
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
                    {renderHeader()}
                    {renderLogo()}
                    {renderForm()}
                    {renderButton()}
                    
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

export default SignUp;