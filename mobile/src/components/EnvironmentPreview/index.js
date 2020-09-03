import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    Dimensions,
    Switch,
    TouchableOpacity
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Image } from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
    AnimatedCircularProgress,  
} from 'react-native-circular-progress';
import DialogBox from 'react-native-dialogbox';

import { colors, metrics } from '../../styles';
import styles from './styles';

import api from '../../services/api';

function EnvironmentPreview({ navigation, environment }) {

    const [isEnabled, setIsEnabled] = useState(null);
    const [sensors, setSensors] = useState([{data: [0]},{data: [0]}]);
    const [isTOk, setIsTOk] = useState(false);
    const [isUAOk, setIsUAOk] = useState(false);
    const [status, setStatus] = useState("");
    const [statusIcon, setStatusIcon] = useState({name: "check-circle", ok: true});


    const toggleSwitch = async () => {
        await api.put(`/synchronization/${environment.nodemcu}`, { connected: !isEnabled })
        .then(Toast.showSuccess(environment.name + 
                                (!isEnabled ? " conectado ao" : " desconectado do") + 
                                ' \ndispositivo ' + 
                                environment.nodemcu));
        setIsEnabled(!isEnabled);
        await api.post('/notifications', {
            origin: `${environment.nodemcu}${!isEnabled ? "conectado" : "desconectado"}`,
            title: `[${environment.nodemcu}] ${!isEnabled ? "Conexão estabelecida" : "Conexão interrompida"}`,
            content: `${!isEnabled ? "Dispositivo está recebendo dados." : "Dispositivo foi desconecetado."}`,
        });
    }

    useEffect(() => {

        async function getSyncStatus() {
            const response = await api.get(`/synchronization/${environment.nodemcu}`);
            setIsEnabled(response.data.connected);
        }

        getSyncStatus();

        async function getSensorsStatus() {

            let statusMessage = "";

            const response = await api.get(`/nodemcu/${environment.nodemcu}/status`, {
                params: {
                    target: "Ambiente",
                    port1: environment.ports[0],
                    port2: environment.ports[1],
                }
            });

            setSensors(response.data);

            if( sensors[0].data[sensors[0].data.length - 1] < environment.ideal_conditions.temperature.min) {
                statusMessage += "Temperatura baixa.\n";
                setIsTOk(false);
                await api.post('/notifications', {
                    origin: sensors[0].nodemcu + sensors[0].port,
                    title: `[${environment.name}] Temperatura baixa`,
                    content: "Suas plantas podem congelar com esse frio.",
                });
            }
            else {
                if(sensors[0].data[sensors[0].data.length - 1] > environment.ideal_conditions.temperature.max) {
                    statusMessage += "Temperatura alta.\n"
                    setIsTOk(false);
                    await api.post('/notifications', {
                        origin: sensors[0].nodemcu + sensors[0].port,
                        title: `[${environment.name}] Temperatura alta`,
                        content: "Esse calor pode queimar suas plantas.",
                    });
                }
                else {
                    setIsTOk(true);
                }
            }

            if( sensors[1].data[sensors[1].data.length - 1] < environment.ideal_conditions.air_humidity.min) {
                statusMessage += "Umidade baixa.";
                setIsUAOk(false);
                await api.post('/notifications', {
                    origin: sensors[1].nodemcu + sensors[1].port,
                    title: `[${environment.name}] Umidade do ar baixa`,
                    content: "As plantas desidratadas podem ressecar.",
                });
            }
            else {
                if(sensors[1].data[sensors[1].data.length - 1] > environment.ideal_conditions.air_humidity.max) {
                    statusMessage += "Umidade alta."
                    setIsUAOk(false);
                    await api.post('/notifications', {
                        origin: sensors[1].nodemcu + sensors[1].port,
                        title: `[${environment.name}] Umidade do ar alta`,
                        content: "Muita umidade favorece pragas e doenças.",
                    });
                }
                else {
                    setIsUAOk(true);
                }
            }

            if(isTOk && isUAOk) {
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

    handleDisplay = async (environment_id, nodemcu, name) => {

        await AsyncStorage.multiSet([
            ['environment_id', environment_id],
            ['nodemcu', nodemcu],
        ]);

        navigation.navigate('Environment', {
            name: name,
        });

    }

    handleDelete = async (environment_id, device) => {

        Alert.alert(
            'Excluir ambiente',
            'Você tem certeza de que deseja excluir este ambiente?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'OK', 
                onPress: async () => {

                    await api.delete(`/environments/${environment_id}`, { device: device });
                    Toast.showSuccess('Ambiente excluído.');
                    await api.post('/notifications', {
                        origin: `${environment.name}excluido`,
                        title: `[${environment.name}] Ambiente excluído`,
                        content: "Você removeu um ambiente.",
                    });
                }
              },
            ],
            {cancelable: false},
          ); 

    }

    handleHistory = async (sensors, index, ideal_conditions) => {

        await AsyncStorage.multiSet([
            ['sensor', JSON.stringify(sensors[index])],
            ['ideal_conditions', JSON.stringify(ideal_conditions)]
        ]);

        navigation.navigate('SensorHistory', {
            name: sensors[index].name,
        });

    }

    return(

        <View style={styles.previewContainer}>
            <TouchableOpacity delayPressIn={150} onLongPress={() => {handleDelete(environment._id, environment.nodemcu)}}>
            {/******BLOCO SUPERIOR: INFORMAÇÕES DO AMBIENTE************/}
            <View style={styles.previewTopBlock}>

                {/******SEÇÃO ESQUERDA: IMAGEM******************************/}
                <View style={styles.previewImageSection}>
                    <Image   
                        style={metrics.previewImage}
                        source={{uri: environment.thumbnail}}
                        borderRadius={metrics.previewImage.borderRadius}  
                        PlaceholderContent={<ActivityIndicator/>}
                    />   
                </View>
                {/**********************************************************/}

                {/******SEÇÃO DIREITA: DESCRIÇÃO****************************/}
                <View style={styles.previewDescriptionSection}>

                    {/******NOME E TIPO*****************************************/}
                    <View style={styles.previewTitleContainer}>
                        <Text style={styles.previewName}>{environment.name}</Text>
                        <Text style={styles.previewLocation}>{environment.location}</Text>
                    </View>
                    {/**********************************************************/}

                    {/******STATUS TEXTUAL**************************************/}
                    <View style={styles.previewTextStatus}>
                        <FontAwesome5 
                            name={statusIcon.name}
                            size={metrics.icon.size}
                            color={statusIcon.ok ? colors.checkIcon : colors.alertIcon}
                            style={{marginRight: metrics.icon.marginRight}}
                        />
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

                    <TouchableOpacity 
                        //onPress={() => navigation.navigate('Temperature', { environment: JSON.stringify(environment)})}
                        onPress={() => 
                            handleHistory(
                                sensors, 
                                0, 
                                {
                                    min: environment.ideal_conditions.temperature.min, 
                                    max: environment.ideal_conditions.temperature.max
                                })
                        }
                    >
                        <View style={styles.statusItemView}>
                            <FontAwesome5 
                                name={"thermometer-half"}
                                size={metrics.icon.size}
                                color={colors.dark}
                                style={{marginRight: metrics.icon.marginRight}}
                            />
                            <Text style={{color: isTOk ? colors.checkIcon : colors.alertIcon}}>
                                {Math.round(sensors[0].data[sensors[0].data.length - 1])}°C
                            </Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        //onPress={() => navigation.navigate('Temperature', { environment: JSON.stringify(environment)})}
                        onPress={() => 
                            handleHistory(
                                sensors, 
                                1,
                                {
                                    min: environment.ideal_conditions.air_humidity.min, 
                                    max: environment.ideal_conditions.air_humidity.max
                                })
                        }
                    >
                        <View style={styles.statusItemView}>
                            <FontAwesome5 
                                name={"water"}
                                size={metrics.icon.size}
                                color={colors.dark}
                                style={{marginRight: metrics.icon.marginRight}}
                            />
                            <Text style={{color: isUAOk ? colors.checkIcon : colors.alertIcon}}>
                                {Math.round(sensors[1].data[sensors[1].data.length - 1])}%
                                </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => { 
                            handleDisplay(environment._id, environment.nodemcu, environment.name)} 
                        }
                    >
                        <View style={styles.statusItemView}>
                            <FontAwesome5 
                                name={"leaf"}
                                size={metrics.icon.size}
                                color={colors.dark}
                                style={{marginRight: metrics.icon.marginRight}}
                            />
                            <Text>{environment.registered_plants}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/**********************************************************/}

                {/******SEÇÃO DIREITA: SINCRONIZAÇÃO************************/}
                <View style={styles.previewSync}>
                    <Switch
                        trackColor={{ false: colors.accept, true: colors.checkIcon }}
                        thumbColor={isEnabled ? colors.header : colors.decline}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    { isEnabled && <Text style={styles.textSync}>ON</Text> }
                    { !isEnabled && <Text style={styles.textSync}>OFF</Text> }
                </View>
                {/**********************************************************/}

            </View>
            {/*********************************************************/}

        </TouchableOpacity>
        <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
        </View>
        
    );

}


export default withNavigation(EnvironmentPreview);