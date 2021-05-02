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

import LinearGradient from 'react-native-linear-gradient';

import {COLORS, SIZES, FONTS, icons, images} from "../constants";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

const GameResult = ({route, navigation}) => {

    const [cardData, setCardData] = useState({
        id: "",
        code: "",
        seri: "",
        provider: ""
    });

    const id = route.params;

    const getUserDataFromLocal = async () => {

        console.log(id.params.id);

        if(id.params.id != null) {
            const result = await firestore()
                .collection("Users")
                .doc(id.params.userid)
                .collection("GameCard")
                .doc(id.params.id)
                .get();

            console.log(result._data.code);
                
            const history = {
                id: result.id,
                code: result._data.code,
                seri: result._data.seri,
                provider: result._data.provider
            } 

            
            setCardData(history);
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
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: "Home" }],
                      })}
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
                <View style = {{
                    marginTop: SIZES.padding * 2, 
                    alignItems: 'center'
                }}>
                    <Text style = {{color: 'black', ...FONTS.body3, fontWeight: 'bold'}}>
                            PUCHARSE SUCCESS!
                    </Text>

                    <Text style = {{color: 'black', fontSize: 14, marginTop: 20}}>
                            Card Information
                    </Text>

                    <Text style = {{color: 'black', fontSize: 14, marginTop: 10}}>
                            Seri: {cardData.seri}
                    </Text>

                    <Text style = {{color: 'black', fontSize: 14, marginTop: 10}}>
                            Code: {cardData.code}
                    </Text>

                    <Text style = {{color: 'black', fontSize: 14, marginTop: 20}}>
                            Notices
                    </Text>
                </View>

                <Text style = {{color: 'black', fontSize: 14, marginTop: 10}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a vulputate neque.
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
                </Text>

            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
            {renderHeader()}
            {renderForm()}
        </SafeAreaView>
    );
}

export default GameResult;