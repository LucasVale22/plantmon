import React, { useState, useEffect } from 'react';
import {  
    SafeAreaView, 
    ScrollView ,
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import { colors, fonts, metrics, general } from '../../styles';

import SensorChart from '../../components/SensorChart';

export default function Temperature({ navigation }) {
    
    const [isLoading, setIsLoading] = useState(true);

    const [sensor, setSensor] = useState({
        name: '',
        data: [0],
        time: [0]
    });
    const [idealConditions, setIdealConditions] = useState({
        min: 0,
        max: 0
    });    

    const [report, setReport] = useState('');
    const [alert, setAlert] = useState('');
    const [dropReport, setDropReport] = useState(false);

    useEffect(() => {

        async function getSensor() {

            await AsyncStorage.multiGet(['sensor', 'ideal_conditions']).then(async (data) => {

                const data_sensor = JSON.parse(data[0][1]);
                setSensor(data_sensor);

                const data_conditions = data[1][1];
                setIdealConditions(data_conditions);
            });

            setIsLoading(false);

        }

        getStatus = () => {

            let  message = '';

            if(sensor.data[sensor.data.length - 1] > idealConditions.max) {
                if(sensor.name == 'Temperatura') {
                    message = "Na última hora a temperatura permaneceu ACIMA do ideal para este ambiente.\n" +
                    "Altas temperaturas prejudicam o desenvolvimento de suas plantas.\n" + 
                    "Os nutrientes podem se tornar escassos devido à desitratação, além de haver a posssibilidade de ressecamento.\n" +
                    "Considere protegê-las em ambientes mais refrigerados, evitando exposição ao calor e radiações intensas.";
                }
                if(sensor.name == 'Umidade do Ar') {
                    message = "Na última hora a umidade doar permaneceu ACIMA do ideal para este ambiente.\n" +
                    "Altas umidades do ar prejudicam o desenvolvimento de suas plantas.\n" + 
                    "O excesso da umidade pode levar ao aparecimento de fungos e outras doenças degradantes.\n" +
                    "Considere aumentar a circulação de ar exposição ao sol para evaporar um pouco da água.";
                }
                if(sensor.name == 'Luminosidade') {
                    message = "Na última hora a luminosidade permaneceu ACIMA do ideal para esta planta.\n" +
                    "Altas luminosidades prejudicam a fotossíntese da sua planta.\n" + 
                    "Exposição a muita radiação pode levar a folhas queimadas e amareladas, inibindo CO2.\n" +
                    "Considere protegê-la do excesso de luz, deslocando para uma sombra mais amena assim que possível.";
                }
                if(sensor.name == 'Umidade do Solo') {
                    message = "Na última hora a umidade do solo permaneceu ACIMA do ideal para esta planta.\n" +
                    "Altas umidades do solo afetam o crescimento saudável da sua planta.\n" + 
                    "O excesso da umidade leva ao apodrecimento das raízes e surgimentos de algumas doenças.\n" +
                    "Considere drenar o excesso de água no substrato, para que o líquido não permaneça retido";
                }
                
                setAlert("CUIDADO!");
                setReport(message);
            } 
            else if(sensor.data[sensor.data.length - 1] < idealConditions.min) {
                if(sensor.name == 'Temperatura') {
                    message = "Na última hora a temperatura permaneceu ABAIXO do ideal para este ambiente." +
                    "Baixas temperaturas retardam o metabolismo de suas plantas." + 
                    "Como os vegetais são constituídos principalmente por água, os fluidos internos podem congelar as células." +
                    "Considere protegê-las em ambientes mais amenos, evitando a exposição a ventos fortes e geadas constantes.";
                }
                if(sensor.name == 'Umidade do Ar') {
                    message = message = "Na última hora a umidade do ar permaneceu ABAIXO do ideal para este ambiente." +
                    "Baixas umidades do ar retardam o metabolismo de suas plantas." + 
                    "A escassez de águas nas estruturas radiculares podem levar ao atrofiamento." +
                    "Considere borrifar um pouco de água em seu ambiente, principalmente sobre as folhas das plantas.";
                }
                if(sensor.name == 'Luminosidade') {
                    message = "Na última hora a luminosidade permaneceu ABAIXO do ideal para esta planta.\n" +
                    "Baixas luminosidades prejudicam a fotossíntese da sua planta.\n" + 
                    "Sua planta necessita de no mínimo agumas horas de sol para realizar esse processo.\n" +
                    "Considere colocá-la próxima a uma fonte de luz por tempo razoável de acordo com a sua espécie.";
                }
                if(sensor.name == 'Umidade do Solo') {
                    message = "Na última hora a umidade do solo permaneceu ABAIXO do ideal para esta planta.\n" +
                    "Baixas umidades do solo afetam o crescimento saudável da sua planta.\n" + 
                    "A falta de umidade leva ao ressecamento da sua planta, impedindo a circulação dos nutrientes.\n" +
                    "Considere irrigar o substrato, mantendo a umidade sempre adequada de acordo com sua espécie.";
                }
                
                setAlert("ATENÇÃO!");
                setReport(message);
            } 
            else {
                message = "Na última hora a temperatura permaneceu adequada para este ambiente." +
                    "Com a temperatura adequada, suas plantas terão um bom metabolismo, crescimento e desenvolvimento." + 
                    "Permaneça monitorando seu ambiente e mantenha-o sempre que possível nesse estado!";
                setAlert("CLIMA AGRADÁVEL!");
                setReport(message);
            }

            return message;
        }

        
        getSensor();

        if(!isLoading) {
            getStatus();
        }
    
    }, [sensor]);

    return (
        <SafeAreaView>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
            >
                
                <SensorChart
                    title={sensor.target}
                    timeData={sensor.time}
                    sensorData={sensor.data}
                    yAxisSuffix={sensor.name == 'Temperatura' ? '°C' : '%'}
                    bgFrom={colors.bgChartFrom}
                    bgTo={colors.bgChartTo}
                />
                
                <View style={[styles.alertContainer, {backgroundColor: alert == "CLIMA AGRADÁVEL!" ? colors.checkIcon : colors.alertIcon}]}>
                    <Text style={styles.alertText}>
                        {alert}
                    </Text>
                    <TouchableOpacity onPress={() => {setDropReport(!dropReport)}}>
                        <FontAwesome5
                            name={dropReport ? "angle-up" : "angle-down"}
                            size={metrics.icon.size}
                            color={colors.light}
                        />
                    </TouchableOpacity>
                </View>
                {dropReport &&
                <View style={styles.reportContainer}>
                    <Text style={styles.reportText}>
                        {report}
                    </Text>
                </View>
                }
    
            </ScrollView>

        </SafeAreaView>
    ); 
    
}