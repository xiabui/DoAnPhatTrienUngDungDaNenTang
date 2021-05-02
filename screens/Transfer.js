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

let BankData = [
    {
        id: 1,
        image: images.visa,
        bank_name: 'Visa',
        bank_number: '3012 **** **** **** 8888',
        selected: true
    },
    {
        id: 2,
        image: images.master,
        bank_name: 'Master Card',
        bank_number: '1234 **** **** **** 4321',
        selected: false
    },
    {
        id: 3,
        image: images.mbbank,
        bank_name: 'MB Bank',
        bank_number: '9012 **** **** **** 1234',
        selected: false
    }
]


const Transfer = ({navigation}) => {

    const [phone, setPhone] = useState();
    const [money, setMoney] = useState(0);

    const [reciever, setReciever] = useState({
        userid: "",
        fullname: "",
        money: ""
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

    const setPhoneData =  async (data) => {

        if(data.length == 10) {
            setPhone(data);
            let currentID = "";
            await firestore()
                .collection('Users')
                .where('phone', 'in', [data])
                .get()
                .then(snapshot => {
                    snapshot.docs.forEach(
                        item => {
                            currentID = item.id;
                        }
                    );
                });

            console.log(currentID);

            const dataResult = await firestore()
                .collection('Users')
                .doc(currentID)
                .get();

            const recieverData = {
                userid: currentID,
                fullname: dataResult.get('fullname'),
                money: dataResult.get('money')
            }  
        
            setReciever(recieverData);
            console.log(reciever.fullname);
        }
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
                            Reciever Phone Number:
                    </Text>
                    <TextInput
                        onChangeText = {phone => setPhoneData(phone)}
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
                            Reciever Name:
                    </Text>
                    <TextInput
                        value={reciever.fullname}
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

                {/*Amount*/}
                <View style = {{marginTop: SIZES.padding}}>
                    <Text style = {{color: '#696969', ...FONTS.body3}}>
                            Enter amount:
                    </Text>
                    <TextInput
                        onChangeText = {money => setMoney(money)}
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

                <Text
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 10,
                        height: 30,
                        width: 30,
                        fontSize: 14,
                        color: '#696969'
                    }}>
                    đ
                </Text>

                {/*Reciever ID*/}
                

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
                            const money2 = Number.parseInt(money);
                            if(money2 <= money1) {
                                const total = money1 - money2;
                                console.log(total);
                                const recieverTotal = Number.parseInt(reciever.money) + money2;

                                const currentDate = new Date();
                           
                                var fullDate = currentDate.getDay() + "/" + currentDate.getMonth() + "/" + currentDate.getYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
                                
                                firestore()
                                    .collection('Users')
                                    .doc(userData.userid)
                                    .collection("History")
                                    .add({
                                        date: fullDate,
                                        money: total,
                                        services: "TRANSFER TO [" + reciever.fullname + "]"
                                    }).done();

                                firestore()
                                    .collection('Users')
                                    .doc(reciever.userid)
                                    .update({
                                        money: recieverTotal,
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
                    <Text style = {{ color: COLORS.white, ...FONTS.h3 }}>Sent</Text>
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

export default Transfer;