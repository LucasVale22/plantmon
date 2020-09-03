import React, { useState, useEffect } from 'react';
import {  
    SafeAreaView, 
    ScrollView ,
    Text,
    View
} from 'react-native';

import styles from '../../components/styles';

import SensorChart from '../../components/SensorChart';

export default function Temperature({ navigation }) {

    const environment = JSON.parse(navigation.getParam('environment'));

    temperatureBehavior = (temperatures, limits, hourRange = 4) => {

        let meanTemperature = 0;

        for(let key = temperatures.length - 1; key >= temperatures.length - hourRange; key--) {

            meanTemperature += temperatures[key] / hourRange;

        }

        console.log(meanTemperature, limits.min, limits.max);

        if(meanTemperature > (limits.min - 2) && meanTemperature < (limits.min + 2)) {
            return 'l'
        } else if(meanTemperature > (limits.max - 2) && meanTemperature < (limits.max + 2)) {
            return 'h'
        } else {
            return 'n'
        }

    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
            >
                
                <SensorChart
                    title={environment.name}
                    timeData={environment.dht11.time}
                    sensorData={environment.dht11.temperature}
                    yAxisSuffix={'°C'}
                    chartColor={"#e6bb00"}
                    bgFrom={'#fb653c'}
                    bgTo={'#dc3304'}
                />
                
                <View>
                    { 
                        temperatureBehavior(environment.dht11.temperature, environment.optimumConditions.temperature) == 'l' &&
                        <Text>
                            ATENÇÃO, VAI CONGELAR!
                            Baixas temperaturas retardam o metabolismo de suas plantas. Como os vegetais são constituídos principalmente por água, os fluidos internos podem congelar as células. Considere protegê-las em amibeintes mais amenos, evitando a exposição a ventos fortes e geadas constantes.</Text>
                    }
                    { 
                        temperatureBehavior(environment.dht11.temperature, environment.optimumConditions.temperature) == 'h' &&
                        <Text>
                            CUIDADO, OLHA ESSE CALORÃO!
                            Altas temperaturas prejudicam o desenvolvimento de suas plantas. Os nutrientes podem se tornar escassos devido à desitratação, além de haver a posssibilidade de ressecamento. Considere protegê-las em ambientes mais refrigerados, evitando exposição ao calor e radiações intensas. </Text>
                    }
                    { 
                        temperatureBehavior(environment.dht11.temperature, environment.optimumConditions.temperature) == 'n' &&
        
                        <Text>
                            QUE CLIMA AGRADÁVEL!
                            Com a temperatura adequada, suas plantas terão um bom metabolismo, crescimento e desenvolvimento. Muito bom!
                        </Text>
                    }
                </View>
    
            </ScrollView>

        </SafeAreaView>
    ); 
    
}