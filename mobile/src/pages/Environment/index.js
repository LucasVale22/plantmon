import React, { useState, useEffect } from 'react';
import { 
    SafeAreaView,
    AsyncStorage, 
    ScrollView,
    View,
    Text
} from 'react-native';

import Toast from 'react-native-tiny-toast';

import PlantPreview from '../../components/PlantPreview';

import api from '../../services/api';

import styles from './styles';

export default function Environment() {

    const [plants, setPlants] = useState([]);
    const [environmentId, setEnvironmentId] = useState('');
    const [nodemcu, setNodemcu] = useState('');

    useEffect(() => {

        async function getPlants() {

            const environment_id = await AsyncStorage.getItem('environment_id');

            const nodemcu = await AsyncStorage.getItem('nodemcu');

            setEnvironmentId(environment_id);
            setNodemcu(nodemcu);
    
            try {
    
                const response = await api.get(`/environments/${environment_id}/plant`);
    
                setPlants(response.data);
                
            } catch (response) {
                setPlants({ error: response.data.error });  
                Toast(plants); 
            }
    
        }

        getPlants();
    
    }, [plants]);

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.containerSubtitle}>
                <Text style={styles.subtitle}>
                    Plantas
                </Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
            >
                {plants.map(plant => <PlantPreview key={plant._id} plant={plant} nodemcu={nodemcu}/>)}
            </ScrollView>

        </SafeAreaView>
    ); 
    
}