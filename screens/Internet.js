import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    SafeAreaView
} from "react-native";

import {COLORS, SIZES, FONTS, icons, images} from "../constants";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { formatNumber } from 'react-native-currency-input';

const setLoginLocal = async (user, money) => {
    try {
        const userModel = {
            userid: user.uid,
            email: user.email,
            fullname: user.fullname,
            money: money
        }
            
        await AsyncStorage.setItem("@UserData", JSON.stringify(userModel)).done();

    } catch (err) {
        console.log(err);
    }
}

const Internet = ({navigation}) => {

    const [code, setCode] = useState();
    const [money, setMoney] = useState(0);
    const [provider, setProvider] = useState({
        id: '',
        name: '',
        money: '',
        date: '',
        isPaid: false
    });

    const [userData, setUserData] = useState({
        userid: "",
        email: "",
        fullname: "",
        money: ""
    });

    const getUserDataFromLocal = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@UserData')
            if (jsonValue != null) {
                const _userData = JSON.parse(jsonValue);
                setUserData(_userData);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const setCodeData =  async (data) => {

        if(data.length == 11) {

            setCode(data);
            const result = await firestore()
                .collection('ElectronicServices')
                .doc(data)
                .get();
                
            if(result != null) {
                const providerData = {
                    id: data,
                    name: result.get('name'),
                    money: result.get('money'),
                    date: result.get('date'),
                    isPaid: result.get('paid')
                }

                setProvider(providerData);
            }
        }
    }

    function moneyFormat(value) {
        const formattedValue = formatNumber(value, {
            suffix: ' đ',
            delimiter: '.',
            signPosition: 'afterPrefix',
        });

        return formattedValue;
    }


    useEffect(() => {
        getUserDataFromLocal();
    }, []);


    function renderHeader() {
        return (
            <View
                style= {{backgroundColor: 'white'}}
            >
                <TouchableOpacity 
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: SIZES.padding * 1,
                        paddingHorizontal: SIZES.padding * 2,
                    }}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Image
                        source ={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.black
                        }}
                    />
                    <Text style={{
                        marginLeft: SIZES.padding * 1.5,
                        color: COLORS.black,
                        ...FONTS.h4
                    }}>Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function isPaid() {
        if(provider.isPaid == true) {
            return <TextInput
                        value={"Paid"}
                        readOnly ={true}
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.gray,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        focusable={true}
                        selectionColor = '#696969'
                    />;
        } else {
            return <TextInput
                        value={"Need Paid"}
                        readOnly ={true}
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.gray,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        focusable={true}
                        selectionColor = '#696969'
                    />;
        }
    }


    function renderForm() {
        return (
            <View
                style = {{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: 'white'
                }}
            >
                <View style = {{marginTop: SIZES.padding * 2}}>
                    <Text style = {{color: '#696969', ...FONTS.body3}}>
                            Customer Code:
                    </Text>
                    <TextInput
                        onChangeText = {code => setCodeData(code)}
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.gray,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        focusable={true}
                        selectionColor = '#696969'
                    />
                </View>

                <View style = {{marginTop: SIZES.padding}}>
                    <Text style = {{color: '#696969', ...FONTS.body3}}>
                            Holder Name:
                    </Text>
                    <TextInput
                        value={provider.name}
                        readOnly ={true}
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.gray,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        focusable={true}
                        selectionColor = '#696969'
                    />
                </View>

                <View style = {{marginTop: SIZES.padding}}>
                    <Text style = {{color: '#696969', ...FONTS.body3}}>
                            Fee:
                    </Text>
                    <TextInput
                        value={moneyFormat(provider.money.toString())}
                        readOnly ={true}
                        style = {{
                            marginVertical: SIZES.padding,
                            borderColor: COLORS.gray,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        focusable={true}
                        selectionColor = '#696969'
                    />
                </View>

                <View style = {{marginTop: SIZES.padding}}>
                    <Text style = {{color: '#696969', ...FONTS.body3}}>
                            Status:
                    </Text>
                    {isPaid()}
                </View>
            </View>
        );
    }

    function submitButton(){
        return (
            <View style={{marginTop: SIZES.padding * 3, marginLeft: 10, marginRight: 10}}>
                <TouchableOpacity 
                    style= {{
                        height: 60,
                        backgroundColor: COLORS.black,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}

                    onPress = {() => {
                        if(userData.userid != null) {

                            const money1 = Number.parseInt(userData.money);
                            const money2 = Number.parseInt(provider.money);
                            if(money2 <= money1) {
                                const total = money1 - money2;
                                const currentDate = new Date();
                                var month = currentDate.getMonth() + 2;
                                var fullDate = currentDate.getDay() + "/" + currentDate.getMonth() + "/" + currentDate.getYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
                                
                                firestore()
                                    .collection('Users')
                                    .doc(userData.userid)
                                    .collection("History")
                                    .add({
                                        date: fullDate,
                                        money: money2,
                                        services: "PAYMENT_INTERNET"
                                    }).done();
                                    
                                const date = month.toString() + '/' + currentDate.getFullYear().toString();

                                firestore()
                                    .collection('ElectronicServices')
                                    .doc(provider.id)
                                    .update({ 
                                        date: date,
                                        money: 0,
                                        paid: true
                                    })
                                    .done();

                                

                                    firestore()
                                    .collection('Users')
                                    .doc(userData.userid)
                                    .update({
                                        money: total,
                                    })
                                    .then(() => {
                                        console.log('User updated!');
                                        setLoginLocal(userData, total);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: "Home" }],
                                          });
                                    }).done();
                            }
                            
                        }

                        
                    } }
                >
                    <Text style = {{ color: COLORS.white, ...FONTS.h3 }}>Pay</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
            {renderHeader()}
            {renderForm()}
            {submitButton()}
        </SafeAreaView>
    );
}

export default Internet;