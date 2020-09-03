import React, { useState, useEffect } from 'react';
const moment = require('moment');

import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import api from '../../services/api';

import styles from './styles';

import { colors, metrics, fonts } from '../../styles';

export default function Devices() {

    const [nodemcus, setNodemcus] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSectionOpened, setIsSectionOpened] = useState([]);

    const [buttonsSensors, setButtonsSensors] = useState({
        t: true,
        ua: false,
        l: false,
        us: false
    });

    useEffect(() => {

        setIsLoading(true);

        /*Carregando todos os dispositivos detectados na rede*/
        async function loadNodemcus () {

            //Obtendo os NodeMCU's
            let response = await api.get('/nodemcu');
        
            let data = response.data;
        
            data = Object.keys(data).map(function(key) {
                return data[key];
                });

            setNodemcus(data);

            nodemcus.map(nodemcu => setIsSectionOpened({...isSectionOpened, [nodemcu.device]: false}));

            //Obtendo os sensores
            response = await api.get(`/sensors`);
        
            data = response.data;
        
            data = Object.keys(data).map(function(key) {
                return data[key];
            });

            setSensors(data);

            setIsLoading(false);
        }

        loadNodemcus();

    }, []);

    renderSensorFlatList = (device, type) => {
        return(
            <View>
                <FlatList
                    data={subItens(device, type)}
                    renderItem={renderSubItens}
                    listKey={moment().valueOf().toString()}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                    <View
                                    
                    >
                        <Text>Nenhum dispositivo detectado.</Text>
                    </View>
                    )}
                />
            </View>
        );
    }

  //Renderizando os subitens em uma "sub flatlist" (sensores)
    renderSubItens = ({ item }) => (

        //<TouchableOpacity>
        /***********************SUBITEM (BLOCO DO SENSOR)*************************/
        <View style={styles.sensorPort}>

            <View>
                <Text>
                    {item.port}
                </Text>
            </View>

            <View style={styles.sensorIcon}>
                <FontAwesome5
                    name={item.connected ? "circle" : "times-circle"}
                    size={metrics.smallIcon.size}
                    color={item.connected ? colors.on : colors.off}
                    solid={true}
                />
            </View>


        </View>
        /**************************************************************************/
        //</TouchableOpacity>
    );

    //Filtrando os sub itens que pertencem a cada item (sensores vinculados a cada nodemcu)
    subItens = (device, type) => {

        let filteredSensors = sensors.filter(sensor => {

            let sensor_device = sensor.nodemcu;
    
            return sensor_device.indexOf(device) > -1;
        });

        let filteredTypes = filteredSensors.filter(sensor => {

            let sensor_type = sensor.name;
    
            return sensor_type.indexOf(type) > -1;
        });

        filteredTypes = Object.keys(filteredTypes).map(function(key) {
            return filteredTypes[key];
        });

        return filteredTypes;

    };

    //Renderizando os itens em uma "flatlist" (nodemcus)
    renderItem = ({ item }) => (

        //<TouchableOpacity>
            /***********************ITEM (BLOCO DO DISPOSITIVO)*************************/
            <View style={styles.deviceBlock}> 
                
                {/******************************SEÇÃO DO NODEMCU******************************/}
                <TouchableOpacity onPress={() => {
                    setIsSectionOpened({[item.device]: !isSectionOpened[item.device]})    
                }}>
                    <View style={styles.nodemcuSection}>

                        {/******************************IDENTIFICAÇÃO******************************/}
                        <View style={styles.nodemcuId}>
                            <Text style={styles.nodemcuName}>
                                {item.name}
                            </Text>
                            <Text style={styles.nodemcuDevice}>
                                {item.device}
                            </Text>
                        </View>
                        {/**************************************************************************/}    

                        {/**********************************CONEXÃO*********************************/}
                        <View style={styles.nodemConn}>
                            <FontAwesome5
                                name={"wifi"}
                                size={metrics.icon.size}
                                color={item.connected ? colors.wifi : colors.decline}
                            />
                        </View>
                        {/**************************************************************************/}

                    </View>
                </TouchableOpacity>
                {/**************************************************************************/}

                {/****************************LISTA DOS SENSORES****************************/}
                { isSectionOpened[item.device] &&
                <View style={styles.sensorsContainer}>
                    {isLoading ? (
                        <View>
                            <ActivityIndicator size="large" color="#bad555" />
                        </View>
                    ) : (
                    <View style={styles.subItemFlatList}>

                        <View style={styles.sensorsButtonsSection}>
                            <TouchableOpacity onPress={() => {
                                setButtonsSensors({t: true, ua: false, l: false, us: false})
                            }}>
                                <Text style={{
                                    color: buttonsSensors.t ? colors.text : colors.decline, 
                                    fontSize: fonts.regular
                                }}>
                                    Temperatura
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setButtonsSensors({t: false, ua: true, l: false, us: false})
                            }}>
                                <Text style={{
                                    color: buttonsSensors.ua ? colors.text : colors.decline, 
                                    fontSize: fonts.regular
                                }}>
                                    Umidade do Ar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setButtonsSensors({t: false, ua: false, l: true, us: false})
                            }}>
                                <Text style={{
                                    color: buttonsSensors.l ? colors.text : colors.decline, 
                                    fontSize: fonts.regular
                                }}>
                                    Luminosidade
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setButtonsSensors({t: false, ua: false, l: false, us: true})
                            }}>
                                <Text style={{
                                    color: buttonsSensors.us ? colors.text : colors.decline, 
                                    fontSize: fonts.regular
                                }}>
                                    Umidade do Solo
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                        {/****************************SENSOR POR TIPO******************************/}
                        { buttonsSensors.t && renderSensorFlatList(item.device, "Temperatura") }

                        { buttonsSensors.ua && renderSensorFlatList(item.device, "Umidade do Ar") }

                        { buttonsSensors.l && renderSensorFlatList(item.device, "Luminosidade") }

                        { buttonsSensors.us && renderSensorFlatList(item.device, "Umidade do Solo") }
                        
                        {/**************************************************************************/}
                        </View>           
                        
                    </View>
                    )}
                    

                    <TouchableOpacity onPress={() => {
                        setIsSectionOpened(!isSectionOpened)    
                    }}>
                        <View style={styles.barAfterOpen}>
                            <FontAwesome5
                                name={"angle-up"}
                                size={metrics.icon.size}
                                color={colors.subText}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                }
                {/**************************************************************************/}

            </View>
            /**************************************************************************/
        //</TouchableOpacity>
    );
  
    //Renderizando a página dos dispostivos
    return (

      <SafeAreaView style={styles.container}>
        
        <View>
            
        </View>
        
        {/***************************LISTA DE DISPOSITIVOS*****************************/}
        <View>
          
          {isLoading ? (
            <View>
              <ActivityIndicator size="large" color="#bad555" />
            </View>
          ) : (
          
          <FlatList
            data={nodemcus}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View>
                <Text>Nenhum dispositivo detectado.</Text>
              </View>
            )}
          />
        )}
        </View>
        {/**************************************************************************/}

      </SafeAreaView>
    );
}