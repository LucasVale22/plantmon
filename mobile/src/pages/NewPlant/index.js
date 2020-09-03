import React, { useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView, 
    AsyncStorage,
} from 'react-native';

import PlantForm from '../../components/PlantForm';

export default function NewPlant({ navigation }) {

    useEffect(() => {

        async function getAndSetPlantData() {
            
            await AsyncStorage.setItem('specie', navigation.getParam('specie'));
            
        }

        getAndSetPlantData();
    
    }, []);
    
    return (
        
        <KeyboardAvoidingView 
            enabled={Platform.OS == 'ios' || Platform.OS == 'android' } 
            behavior="padding"
        >

            <ScrollView showsVerticalScrollIndicator={false}>
                
                <View>

                    <PlantForm/>

                </View>

            </ScrollView>
            
        </KeyboardAvoidingView>

    );
}