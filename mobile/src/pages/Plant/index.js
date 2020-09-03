import React, {useEffect, useState} from 'react';
import { 
    View, 
    Text, 
    AsyncStorage,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    TouchableOpacity 
} from 'react-native';
import { Image } from 'react-native-elements';
import {
    AnimatedCircularProgress,  
} from 'react-native-circular-progress';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import { general, colors, metrics, fonts } from '../../styles';

import api from '../../services/api';

export default function Plant() {

    const [sensors, setSensors] = useState({
        light:  0,
        soil_moisture: 0
    });

    const [plant, setPlant] = useState({
        thumbnail:  "../../assets/species/croton.jpg",
        ports: ["", ""],
        location: '',
        createdAt: ''
    });
    const [specie, setSpecie] = useState({
        scientific_name: '',
        height: '',
        cycle: '',
        ideal_conditions: {
            light: {
                min: 0,
                max: 0,
            },
            soil_moisture: {
                min: 0,
                max: 0,
            }
        }
    });

    const [changeSection, setChangeSection] = useState(false);

    useEffect(() => {

        async function getDetails() {

            //const data = JSON.parse(await AsyncStorage.getItem('plant'));
            AsyncStorage.multiGet(['plant', 'sensor_values']).then(async (data) => {

                const data_plant = JSON.parse(data[0][1]);
                setPlant(data_plant);

                const species_response = await api.get(`/species/${data_plant.specie}`);
                setSpecie(species_response.data);

                const sensor_values = JSON.parse(data[1][1]);
                setSensors(sensor_values);
            });

        }

        getDetails();

    
    }, [plant]);

    const { ideal_conditions } = specie;

    return (

        <SafeAreaView style={general.container}>

            <ScrollView>

                {/******************EXTENSÃO DO HEADER (TITULO)*********************/}
                <View style={styles.headerExtension}>
                    <Text style={styles.nickname}>
                        {plant.nickname}
                    </Text>
                    <Text style={styles.scientificName}>
                        {specie.scientific_name}
                    </Text>
                </View>
                {/******************************************************************/}

                {/******************************IMAGEM******************************/}
                <View style={styles.imageBlock}>

                    <Image 
                        style={styles.image}
                        source={{uri: plant.thumbnail}}
                        PlaceholderContent={<ActivityIndicator/>}
                        borderRadius={150}
                    />

                </View>
                {/******************************************************************/}
                
                <View style={styles.initialBlock}>
                    <View style={styles.titleView}>
                        <Text style={styles.detaislTitle}>Criada em</Text>
                        <Text style={styles.text}>  
                            {`${(new Date(plant.createdAt)).getDay()}/${(new Date(plant.createdAt)).getMonth()}/${(new Date(plant.createdAt)).getFullYear()} às ${(new Date(plant.createdAt)).getHours()}:${(new Date(plant.createdAt)).getMinutes()}h`}
                        </Text>
                    </View>
                    <View style={styles.titleView}>
                        <Text style={styles.detaislTitle}>Local de plantio</Text>
                        <Text style={styles.text}>{plant.location}</Text>
                    </View>

                    <View style={[styles.titleView, {flexDirection: 'row'}]}>
                        <TouchableOpacity onPress={() => {setChangeSection(false)}}>
                            <View style={{backgroundColor: !changeSection ? colors.decline : null}}>
                                <Text style={styles.detaislTitle}>
                                    Dados da espécie
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setChangeSection(true)}}>
                            <View style={{marginLeft: 20, backgroundColor: changeSection ? colors.decline : null}}>
                                <Text style={styles.detaislTitle}>
                                    Status dos Sensores 
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                </View>


                {/****************************INFORMAÇÕES***************************/}
                
                {!changeSection && 
                <View style={styles.detailsBlock}>
                    

                    <View style={styles.details}>

                        <View style={styles.property}>
                            <View style={styles.propertyName}>
                                <Text style={styles.text}>
                                    Altura
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.subText}>
                                {
                                    parseFloat(specie.height.split(' ', 3)[2]) < 1.0 ? 
                                        "Pequeno " : 
                                            parseFloat(specie.height.split(' ', 3)[2]) < 3.0 ? 
                                                "Médio " :
                                                    "Grande "
                                }({specie.height})
                                </Text>
                                
                            </View>
                        </View>  

                        <View style={styles.property}>
                            <View style={styles.propertyName}>
                                <Text style={styles.text}>
                                        Ciclo
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.subText}>
                                {specie.cycle}
                                {
                                    specie.cycle == "Perene" ? 
                                        " (1 ano)" : " (2 anos)"
                                }
                                </Text>
                            </View> 
                        </View>  

                        <View style={styles.property}>
                            <View style={styles.propertyName}>
                                <Text style={styles.text}>
                                    Luminosidade
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.subText}>
                                    Meia-sombra ({ideal_conditions.light.min} - {ideal_conditions.light.max} %)
                                </Text>
                            </View>  
                        </View>  

                        <View style={styles.property}>
                            <View style={styles.propertyName}>
                                <Text style={styles.text}>
                                        Umidade do solo
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.subText}>
                                    Alta ({ideal_conditions.soil_moisture.min} - {ideal_conditions.soil_moisture.max}) %
                                </Text>
                            </View> 
                        </View>  

                    </View>

                </View>
                }
                {/******************************************************************/}

                {/******************************STATUS******************************/}
                {changeSection &&
                <View style={styles.statusSection}>
                    
                    <View style={{justifyContent: 'center'}}>

                        <AnimatedCircularProgress
                            size={metrics.halfScreen.width - 50}
                            width={16}
                            fill={sensors.light}
                            tintColor={colors.ldr}
                            backgroundColor="#3d5875"
                            arcSweepAngle={360}
                            rotation={180}
                        >
                        {
                            (fill) => (
                                <View>
                                    <FontAwesome5 
                                        name={"sun"}
                                        size={metrics.icon.size}
                                        color={colors.ldr}
                                        //style={{marginRight: metrics.icon.marginRight}}
                                    />
                                    
                                    <Text style={[styles.statusNumber, {color: colors.ldr}]}> 
                                        { fill } %
                                    </Text>
                                </View>
                            )
                        }
                        </AnimatedCircularProgress>

                        <Text style={styles.subText}>{plant.ports[0]}</Text>

                    </View>

                    <View>

                        <AnimatedCircularProgress
                            size={metrics.halfScreen.width - 50}
                            width={16}
                            fill={sensors.soil_moisture}
                            tintColor={colors.hig}
                            backgroundColor="#3d5875"
                            arcSweepAngle={360}
                            rotation={180}
                        >
                        {
                            (fill) => (
                                <View>
                                    <FontAwesome5 
                                        name={"tint"}
                                        size={metrics.icon.size}
                                        color={colors.hig}
                                        //style={{marginRight: metrics.icon.marginRight}}
                                    />
                                    
                                    <Text style={[styles.statusNumber, {color: colors.hig}]}> 
                                        { fill } %
                                    </Text>
                                </View>
                            )
                        }
                        </AnimatedCircularProgress>

                        <Text style={styles.subText}>{plant.ports[1]}</Text>

                    </View>

                </View>
                }
                {/******************************************************************/}

            </ScrollView>
            
        </SafeAreaView>
    );
}