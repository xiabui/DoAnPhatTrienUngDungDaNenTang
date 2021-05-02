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

let HistoryList = [];

const Wallet = ({navigation}) => {

    const [userData, setUserData] = useState({
        userid: "",
        email: "",
        phone: "",
        fullname: "",
        money: ""
    });

    const [temp, setTemp] = useState(HistoryList);

    const addToHistoryList = (history) => {
        console.log('hello');
        HistoryList.push(history);
        setTemp(HistoryList);
        setTemp("");
    }

    const readDataFromFirebase = async (userid) => {
        await firestore()
            .collection("Users")
            .doc(userid)
            .collection("History")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const history = {
                        id: documentSnapshot.id,
                        date: documentSnapshot.get("date"),
                        money: documentSnapshot.get("money"),
                        services: documentSnapshot.get("services")
                    } 

                    addToHistoryList(history);
                });
            });
    }

    const getUserDataFromLocal = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@UserData')
            if (jsonValue != null) {
                const _userData = JSON.parse(jsonValue);
                readDataFromFirebase(_userData.userid);
                setUserData(_userData);
            }
        } catch (e) {
            console.log(e);
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

    function renderList() {

        const renderItem = ({ item }) => (
            <TouchableOpacity>
                <View
                    style={{
                        borderRadius: 5,
                        padding: 10,
                        backgroundColor: 'white',
                        marginBottom: 5
                    }}
                >
                    <View style ={{flex: 1, flexDirection:'row', justifyContent: 'space-between'}}>
                        <Text>{item.date}</Text>
                        <Text>{item.services}</Text>
                        
                    </View>

                    <Text style = {{color: 'red', fontSize: 16, fontWeight: 'bold'}}>{moneyFormat(item.money)}</Text>

                </View>
            </TouchableOpacity>
        );
        if(HistoryList != null) {
            return (
            
                <View>
                    <FlatList
                        data={HistoryList}
                        keyExtractor={item => `${item.id}`}
                        renderItem={renderItem}
                        style={{ marginTop: 10}}
                    />
                </View>
            );
        } else {
            return (
            
                <View>
                    
                </View>
            );
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
                <Text style = {{color: 'red', fontSize: 24, fontWeight: 'bold'}}>
                    {moneyFormat(userData.money)}
                </Text>

                <Text style = {{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
                    {userData.fullname.toUpperCase()}
                </Text>

                <Text style = {{color: 'black', fontSize: 18}}>
                    ID: {userData.userid}
                </Text>

                <Text style = {{color: 'black', fontSize: 18}}>
                    Phone: {userData.phone}
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
            {renderHeader()}
            {renderForm()}
            <Text style={{marginLeft: 10, marginTop: 10}}>History: </Text>
            {renderList()}
        </SafeAreaView>
    );
}

export default Wallet;