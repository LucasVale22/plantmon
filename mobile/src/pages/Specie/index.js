import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    AsyncStorage

} from 'react-native';
import { Image } from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';

import styles from './styles';

import { metrics } from '../../styles';

export default function Specie({ navigation }) {

    const [specie, setSpecie] = useState(
        {
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
        }
    );

    const [uriImage, setUriImage] = useState("../../assets/species/croton.jpg");
    
    const [hideButton, setHideButton] = useState(false);

    useEffect(() => {

        async function getSpecieData() {

            //const response = JSON.parse(await AsyncStorage.getItem('specie'));

            await AsyncStorage.multiGet(['specie', 'uri_image']).then(async (data) => {

                const data_specie = JSON.parse(data[0][1]);
                setSpecie(data_specie);

                const uri_data = data[1][1];
                setUriImage(uri_data);
            });

        }

        getSpecieData();

    
    }, [specie]);

    const { ideal_conditions } = specie;

    viewMore = (onPress) => {
        return(
            <Text onPress={onPress} style={styles.viewMoreText}>ver mais...</Text>
        );
    }

    viewLess = (onPress) => {
        return(
            <Text onPress={onPress} style={styles.viewMoreText}>ver menos...</Text>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                onScrollBeginDrag={() => {
                    setHideButton(true)
                }}
                onScrollEndDrag={() => {
                    setHideButton(false)
                }}
            >
                {/************************************PRINCIPAL*********************************/}
                <View style={styles.previewContainer}>

                    {/************************************DESCRIÇÃO*********************************/}
                    <View style={styles.description}>

                        {/**********************************IDENTIFICACAO*******************************/}
                        <View style={styles.identification}>

                            {/**********************************NOME POPULAR********************************/}
                            <View>
                                <Text style={styles.text}>{specie.scientific_name}</Text>
                            </View>
                            {/******************************************************************************/}

                            {/********************************NOME CIENTIFICO*******************************/}
                            <View>
                                <Text style={styles.subText}>Popular: {specie.popular_name}</Text>
                            </View>
                            {/******************************************************************************/}

                        </View>
                        {/******************************************************************************/}

                        {/**********************************CLASSIFICACAO*******************************/}
                        <View style={styles.classification}>

                            {/*************************************IMAGEM***********************************/}
                            <View style={styles.imageBlock}>
                                <Image 
                                    style={styles.image}
                                    source={{uri: uriImage}}
                                    PlaceholderContent={<ActivityIndicator/>}
                                    borderRadius={150}
                                />
                            </View>
                            {/******************************************************************************/}

                            {/*************************************GRUPOS***********************************/}
                            <View style={styles.groupBlock}>

                                {/*************************************FAMILIA**********************************/}
                                <View>
                                    <Text style={styles.text}>Família</Text>
                                    <Text style={[styles.subText, {textAlign: 'left'}]}>{specie.family}</Text>
                                </View>
                                {/******************************************************************************/}

                                {/************************************CATEGORIA*********************************/}
                                <View style={{paddingLeft: 20}}>
                                    <Text style={styles.text}>Categoria</Text>
                                    <Text style={[styles.subText, {textAlign: 'left'}]}>{specie.category}</Text>
                                </View>
                                {/******************************************************************************/}

                                {/*************************************ORIGEM***********************************/}
                                <View style={{paddingLeft: 35}}>
                                    <Text style={styles.text}>Origem</Text>
                                    <Text style={[styles.subText, {textAlign: 'left'}]}>{specie.origin}</Text>
                                </View>
                                {/******************************************************************************/}

                            </View>
                            {/******************************************************************************/}
                        
                        </View>
                        {/******************************************************************************/}

                    </View>
                    {/******************************************************************************/}
                    
                    {/************************************CUIDADOS**********************************/}
                    <View style={styles.care}>
                        
                        {/*************************************ALTURA***********************************/}
                        <View style={styles.careItem}>
                            <View style={[styles.careItemSpace, {width: 60}]}></View>
                            <View style={[styles.careItemTitle, {width: metrics.halfScreen.width - 10}]}><Text style={styles.text}>Altura</Text></View>
                            <View style={styles.careItemContent}><Text style={styles.subText}>{specie.height}</Text></View>
                            {/*<View style={styles.careItemContent}><Text style={styles.subText}>{parseFloat(specie.height.split(' ', 3)[2]) < 1.0 ? "Pequeno " : parseFloat(specie.height.split(' ', 3)[2]) < 3.0 ? "Médio " : "Grande "}({specie.height})</Text></View>*/}
                        </View>
                        {/******************************************************************************/}

                        {/**************************************CICLO***********************************/}
                        <View style={styles.careItem}>
                            <View style={[styles.careItemSpace, {width: 80}]}></View>
                            <View style={[styles.careItemTitle, {width: metrics.halfScreen.width - 30}]}><Text style={styles.text}>Ciclo</Text></View>
                            <View style={styles.careItemContent}><Text style={styles.subText}>{specie.cycle}</Text></View>   
                        </View>
                        {/******************************************************************************/}

                        {/***********************************LUMINOSIDADE*******************************/}
                        <View style={styles.careItem}>
                            <View style={[styles.careItemSpace, {width: 20}]}></View>
                            <View style={[styles.careItemTitle, {width: metrics.halfScreen.width + 30}]}><Text style={styles.text}>Luminosidade</Text></View>
                            <View style={styles.careItemContent}><Text style={styles.subText}>{ideal_conditions.light.min} - {ideal_conditions.light.max} %</Text></View> 
                        </View>
                        {/******************************************************************************/}

                        {/*************************************UMIDADE**********************************/}
                        <View style={styles.careItem}>
                            <View style={styles.careItemSpace}></View>
                            <View style={styles.careItemTitle}><Text style={styles.text}>Umidade do solo</Text></View>
                            <View style={styles.careItemContent}><Text style={styles.subText}>{ideal_conditions.soil_moisture.min} - {ideal_conditions.soil_moisture.max} %</Text></View>
                        </View>
                        {/******************************************************************************/}

                    </View>
                    {/******************************************************************************/}

                    {/*<View style={stylesS.details}>

                        <View style={stylesS.itemHeader}>
                            <TouchableOpacity 
                                style={stylesS.itemButton}
                                onPress={() => setSelected(true)}
                            >
                                <Text>Descrição</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={stylesS.itemButton}
                                onPress={() => setSelected(false)}
                            >
                                <Text>Cuidados</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {selected &&
                        <View style={stylesS.section}>

                            
                            
                        </View>
                        }

                        {!selected &&
                        <View style={stylesS.section}>
                            
                           
                            
                        </View>
                        }

                    </View>*/}
                </View>
                {/******************************************************************************/}

                {/*********************************MAIS INFORMAÇÕES*****************************/}
                <View style={styles.viewMore}>
                    <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={viewMore}
                        renderViewLess={viewLess}
                        textStyle={{textAlign: 'justify'}}
                    >
                        <Text style={[styles.subtitle, { textAlign: 'justify' }]}>{specie.description}</Text>
                    </ViewMoreText>       
                </View>
                {/******************************************************************************/}
                
            </ScrollView>
            
            {!hideButton && <View style={styles.buttonView}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('NewPlant', {specie: JSON.stringify(specie)})}
                >
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>}
            

        </SafeAreaView>
    );
}