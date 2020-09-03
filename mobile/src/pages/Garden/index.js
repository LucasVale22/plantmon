import React, { useState, useEffect } from 'react';
import { 
    Text,
    View,
    SafeAreaView, 
    ScrollView 
} from 'react-native';

import  EnvironmentPreview  from '../../components/EnvironmentPreview';

import styles from './styles';

import api from '../../services/api';

export default function Garden({ navigation }) {

    const [environments, setEnvironments] = useState([]);
    const [backgroundText, setBackgroundText] = useState('');

    useEffect(() => {


        async function getEnvironments() {
    
            try {
    
                const response = await api.get('/environments');
    
                setEnvironments(response.data);

                if(response.data.length == 0)
                    setBackgroundText("Você não possui nenhum ambiente cadastrado. Pressione o botão '+'' para adionar.");
                else
                    setBackgroundText('');
                
            } catch (response) {
                setEnvironments({ error: response.data.error });   
            }
    
        }

        getEnvironments();


    }, [environments]);

    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.containerSubtitle}>
                <Text style={styles.subtitle}>
                    Ambientes
                </Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
            >
                {!!backgroundText && <Text>{backgroundText}</Text>}
                {environments.map(environment => <EnvironmentPreview key={environment._id} environment={environment}/>)}
            </ScrollView>

        </SafeAreaView>
    ); 
    
}