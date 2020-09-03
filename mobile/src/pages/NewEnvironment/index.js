import React from 'react';
import { 
    View,  
    KeyboardAvoidingView, 
    Platform, 
    ScrollView
} from 'react-native';

import EnvironmentForm from '../../components/EnvironmentForm';

export default function NewEnvironment({ navigation }) {
    
    return (

        <KeyboardAvoidingView 
            enabled={Platform.OS == 'ios' || Platform.OS == 'android' } 
            behavior="height" 
        >

            <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode={'on-drag'}>
                <View>

                    <EnvironmentForm/>

                </View>
            </ScrollView>

        </KeyboardAvoidingView>

    );
}