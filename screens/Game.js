import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ToastAndroid,
    SafeAreaView
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';

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
        image: icons.garena,
        bank_name: 'Garena',
        selected: true
    },
    {
        id: 2,
        image: icons.vinagame,
        bank_name: 'VinaGame',
        selected: false
    },
    {
        id: 3,
        image: icons.zing,
        bank_name: 'ZingCoin',
        selected: false
    }
]


const Game = ({navigation}) => {

    const [money, setMoney] = useState(0);
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

                {/*Username*/}
                <View style = {{marginTop: SIZES.padding * 2}}>
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
                    ??
                </Text>

            </View>
        );
    }

    function renderHeaderBank(){
        return(
            <View
                style = {{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingTop: 10,
                }}>
                <View style = {{ flexDirection: 'row', }}>
                    <Text style = {{fontWeight: 'bold'}}>Ch???n lo???i v??</Text>
                    <Text style = {{fontWeight: 'bold', fontSize: 12, marginLeft: 5, paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5, backgroundColor: 'red', color: 'white', borderRadius: 2}}>Mi???n ph??</Text>
                </View>

                <Text style = {{fontSize: 12,}}>M???i giao d???ch tr??n Digital Wallet ?????u mi???n ph??.</Text>
            </View>
        );
    }


    function checked(item) {
        let checkBox;
        if(item == false) {
            checkBox = <View></View>;
        } else {
            checkBox = <Image source={icons.checked} style={{ width: 20, height: 20 }}/>
        }
        return checkBox;
    }

    function renderListBank() {

        const renderItem = ({ item }) => (
            <TouchableOpacity onPress={() => {item.selected = true;}}>
                <View
                    style={{
                        borderRadius: 5,
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop: 10,
                        paddingBottom: 10,
                    }}
                >
                    <Image
                        source={item.image}
                        resizeMode="cover"
                        style={{
                            height: 40,
                            width: 40,
                            tintColor: item.color,
                        }}
                    />

                    <View style ={{flex: 1, flexDirection:'row', justifyContent: 'space-between'}}>
                        <View style = {{marginLeft: 20}}>
                            <Text style = {{fontWeight: 'bold'}}>{item.bank_name}</Text>
                        </View>
                        
                        {checked(item.selected)}
                        
                    </View>

                </View>
            </TouchableOpacity>
        );

        return (
            <View>
                <FlatList
                    data={BankData}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}
                    style={{ marginTop: 10, paddingHorizontal: 10, backgroundColor: 'white'}}
                />
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

                    onPress = { async () => {
                        if(userData.userid != null) {

                            const money1 = Number.parseInt(userData.money);
                            const money2 = Number.parseInt(money);
                            if(money2 <= money1 && money2 >= 10000) {
                                const total = money1 - money2;
                                console.log(total);

                                const currentDate = new Date();
                            
                                var fullDate = currentDate.getDay() + "/" + currentDate.getMonth() + "/" + currentDate.getYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
                                firestore()
                                    .collection('Users')
                                    .doc(userData.userid)
                                    .collection("History")
                                    .add({
                                        date: fullDate,
                                        money: money2,
                                        services: "GAME_CARD_PAID"
                                    }).done();

                                let id = "";

                                firestore()
                                    .collection('Users')
                                    .doc(userData.userid)
                                    .collection("GameCard")
                                    .add({
                                        code: "234212134",
                                        seri: "123421334",
                                        provider: "GARENA"
                                    })
                                    .then((doc) => {
                                        id = doc.id;
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
                                        navigation.navigate('GameResult', {
                                            params: {id: id, userid: userData.userid}
                                        });
                                    });
                            } else {
                                ToastAndroid.show("Minimim card is 10.000?? !", ToastAndroid.SHORT);
                            }
                            
                        }
                    } }
                >
                    <Text style = {{ color: COLORS.white, ...FONTS.h3 }}>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
            {renderHeader()}
            {renderForm()}
            {renderHeaderBank()}
            {renderListBank()}
            {submitButton()}
        </SafeAreaView>
    );
}

export default Game;