import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Image } from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { colors, metrics } from '../../styles';
import styles from './styles';

import api from '../../services/api';

//import PlantMenu from '../components/PlantMenu';

function PlantPreview({ navigation, plant, nodemcu }) {

    const [sensors, setSensors] = useState([{data: [0]},{data: [0]}]);
    const [specie, setSpecie] = useState({
        ideal_conditions: {
           light: {
               min: 0, 
               max: 0
           },
           soil_moisture: {
               min: 0,
               max: 0
            }
        }
    });
    const [isLOk, setIsLOk] = useState(false);
    const [isUSOk, setIsUSOk] = useState(false);
    const [status, setStatus] = useState("");
    const [statusIcon, setStatusIcon] = useState({name: "check-circle", ok: true});

    useEffect(() => {

        async function getSpecie() {
             /*Resgatando a espécie desta planta*/
            
             const response = await api.get(`/species/${plant.specie}`);

             setSpecie(response.data);
        }

        getSpecie();

        async function getSensorsStatus() {

            let statusMessage = "";

            /*Resgatando os dados de leituras dos sensores vinculados a esta planta pelas portas*/
            const response = await api.get(`/nodemcu/${nodemcu}/status`, {
                params: {
                    target: "Planta",
                    port1: plant.ports[0],
                    port2: plant.ports[1],
                }
            });
            
            setSensors(response.data);

            /*Gerando mensagens de status: avaliando as leituras em relação às condições ótimas*/
           
            //Alertas de atenção para a luminosidade
            if( sensors[0].data[sensors[0].data.length - 1] < specie.ideal_conditions.light.min) {
                statusMessage += "Luminosidade baixa.\n";
                setIsLOk(false);
                await api.post('/notifications', {
                    origin: sensors[0].nodemcu + sensors[0].port,
                    title: `[${plant.nickname}] Luminosidade baixa`,
                    content: "A fotossíntese poderá ser prejudicada.",
                });
            }
            else {
                if(sensors[0].data[sensors[0].data.length - 1] > specie.ideal_conditions.light.max) {
                    statusMessage += "Luminosidade alta.\n";
                    setIsLOk(false);
                    await api.post('/notifications', {
                        origin: sensors[0].nodemcu + sensors[0].port,
                        title: `[${plant.nickname}] Luminosidade alta`,
                        content: "O excesso de radiação é perigoso.",
                    });
                }
                else {
                    setIsLOk(true);
                }
            }
            
            //Alertas de atenção para a umidade do solo
            if( sensors[1].data[sensors[1].data.length - 1] < specie.ideal_conditions.soil_moisture.min) {
                statusMessage += "Umidade baixa.";
                setIsUSOk(false);
                await api.post('/notifications', {
                    origin: sensors[1].nodemcu + sensors[1].port,
                    title: `[${plant.nickname}] Umidade do solo baixa`,
                    content: "A água é essencial no crescimento saudável.",
                });
            }
            else {
                if(sensors[1].data[sensors[1].data.length - 1] > specie.ideal_conditions.soil_moisture.max) {
                    statusMessage += "Umidade alta.";
                    setIsUSOk(false);
                    await api.post('/notifications', {
                        origin: sensors[1].nodemcu + sensors[1].port,
                        title: `[${plant.nickname}] Umidade do solo alta`,
                        content: "Excesso de água pode apodrecer as raízes",
                    });
                }
                else {
                    setIsUSOk(true);
                }
            }
            //console.log(statusMessage);
            //Se ambos os sensores estiverem "ok", gera alerta de condições ótimas
            if(isLOk && isUSOk) {
                statusMessage += "Condições ótimas.";
                setStatus(statusMessage);
                setStatusIcon({name: "check-circle", ok: true});
            }
            else {
                
                setStatus(statusMessage);
                setStatusIcon({name: "exclamation-triangle", ok: false});
            }

        }

        getSensorsStatus();
        
    }, [sensors]);

    async function handleDisplay(plant, sensor_values) {

        await AsyncStorage.multiSet([
            ['plant', JSON.stringify(plant)],
            ['sensor_values', JSON.stringify(sensor_values)]
        ]);

        navigation.navigate('Plant');
    }

    async function  handleDelete(plant_id, environment_id) {

        console.log(`environments/${environment_id}/plant/${plant_id}`);
        Alert.alert(
            'Excluir planta',
            'Você tem certeza de que deseja excluir esta planta?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'OK', 
                onPress: async () => {
                    await api.delete(`environments/${environment_id}/plant/${plant_id}`);
                    Toast.showSuccess('Planta excluída.');
                    await api.post('/notifications', {
                        origin: sensors[1].nodemcu + sensors[1].port,
                        title: `[${plant.nickname}] Planta excluída`,
                        content: "Você removeu uma planta.",
                    });
                }
              },
            ],
            {cancelable: false},
          ); 
    }

    handleHistory = async (sensors, index) => {

        await AsyncStorage.setItem('sensor', JSON.stringify(sensors[index]));

        navigation.navigate('SensorHistory', {
            name: sensors[index].name,
        });

    }

    return(

        <View style={styles.previewContainer}>
            <TouchableOpacity 
                delayPressIn={150} 
                onLongPress={() => {
                    handleDelete(plant._id, plant.environment)
                }}
            >
            {/************BLOCO SUPERIOR: INFORMAÇÕES DA PLANTA*************/}
            <View style={styles.previewTopBlock}>

                {/******SEÇÃO ESQUERDA: IMAGEM******************************/}
                <View style={styles.previewImageSection}>
                    <Image   
                        style={metrics.previewImage}
                        source={{uri: plant.thumbnail}}
                        borderRadius={metrics.previewImage.borderRadius}  
                        PlaceholderContent={<ActivityIndicator/>}
                    />   
                </View>
                {/**********************************************************/}

                {/******SEÇÃO DIREITA: DESCRIÇÃO****************************/}
                <View style={styles.previewDescriptionSection}>

                    {/*********************NOME E LOCAL*************************/}
                    <View style={styles.previewTitleContainer}>
                        <Text style={styles.previewName}>{plant.nickname}</Text>
                        <Text style={styles.previewLocation}>{plant.location}</Text>
                    </View>
                    {/**********************************************************/}

                    {/******STATUS TEXTUAL**************************************/}
                    <View style={styles.previewTextStatus}>
                        {<FontAwesome5 
                            name={statusIcon.name}
                            size={metrics.icon.size}
                            color={statusIcon.ok ? colors.checkIcon : colors.alertIcon}
                            style={{marginRight: metrics.icon.marginRight}}
                        />}
                        <Text style={styles.previewStatus}>{status}</Text>
                    </View>
                    {/**********************************************************/}

                </View>
                {/**********************************************************/}

            </View>
            {/*********************************************************/}

            {/******BLOCO INFERIOR: INFORMAÇÕES DOS SENSORES***********/}
            <View style={styles.previewBottomBlock}>

                {/******SEÇÃO ESQUERDA: STATUS NUMÉRICO*********************/}
                <View style={styles.previewNumericStatus}>
                    <TouchableOpacity onPress={() => handleHistory(sensors, 0)}>
                        <View style={styles.statusItemView}>
                            <FontAwesome5 
                                name={"sun"}
                                size={metrics.icon.size}
                                color={colors.dark}
                                style={{marginRight: metrics.icon.marginRight}}
                            />
                            <Text style={{color: isLOk ? colors.checkIcon : colors.alertIcon}}>
                                {Math.round(sensors[0].data[sensors[0].data.length - 1])}%
                            </Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => handleHistory(sensors, 1)}>
                        <View style={styles.statusItemView}>
                            <FontAwesome5 
                                name={"tint"}
                                size={metrics.icon.size}
                                color={colors.dark}
                                style={{marginRight: metrics.icon.marginRight}}
                            />
                            <Text style={{color: isUSOk ? colors.checkIcon : colors.alertIcon}}>
                                {Math.round(sensors[1].data[sensors[1].data.length - 1])}%
                                </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { 
                            handleDisplay(
                                plant, 
                                {
                                    light: Math.round(sensors[0].data[sensors[0].data.length - 1]),
                                    soil_moisture: Math.round(sensors[1].data[sensors[1].data.length - 1])
                                }
                            )
                        } 
                    }>
                        <View style={styles.statusItemView}>
                            <FontAwesome5 
                                name={"info-circle"}
                                size={metrics.icon.size}
                                color={colors.dark}
                                style={{marginRight: metrics.icon.marginRight}}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                {/**********************************************************/}

                {/******SEÇÃO DIREITA: ?????????????************************/}
                <View style={styles.previewSync}>
                    
                </View>
                {/**********************************************************/}

            </View>
            {/*********************************************************/}
            </TouchableOpacity>
            {/*<View style={styles.details}>

                <View style={styles.status}>
                    <View style={styles.statusItem}>
                        <Text>Espécie: </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <TouchableOpacity onPress={() => 
                            navigation.navigate('SoilMoisture', { plant: JSON.stringify(plant)})
                        }>
                            <Image style={styles.iconImage} source={soilmoisture}/>
                        </TouchableOpacity>
                        <Text style={styles.statusText}> {plant.soilMoisture.sensor[plant.soilMoisture.sensor.length - 1]} </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <TouchableOpacity onPress={() => 
                            navigation.navigate('Light', { plant: JSON.stringify(plant)})
                        }>
                            <Image style={styles.iconImage} source={light}/>
                        </TouchableOpacity>
                        <Text style={styles.statusText}> {plant.light.sensor[plant.light.sensor.length - 1]}</Text>
                    </View>
                </View>

                <View style={styles.options}>
                    
                </View>

                    </View>*/}

        </View>

    );

}

export default withNavigation(PlantPreview);