import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Image,

} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import Toast from 'react-native-tiny-toast';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { withNavigation } from 'react-navigation';

import styles from './styles';
import { colors, metrics, fonts } from '../../styles';

import api from '../../services/api';

const amounts = [
    {
        label: '1',
        value: 1,
    },
    {
        label: '2',
        value: 2,
    },
    {
        label: '3',
        value: 3,
    },
    {
        label: '4',
        value: 4,
    }
];

specie = [];
nodemcu = []
lightSensors = [];
soilMoistureSensors = [];

getLightSensors = async (environment_id, name) => {

    let response = await api.get(`/environments/${environment_id}`);

    nodemcu = response.data.nodemcu;

    response = await api.get(`/nodemcu/${nodemcu}/${name}/link`, { name: name });

    lightSensors = response.data.map(sensor => ({ value: sensor.port, label: sensor.port }));

}

getSoilMoistureSensors = async (environment_id, name) => {

    let response = await api.get(`/environments/${environment_id}`);

    const nodemcu = response.data.nodemcu;

    response = await api.get(`/nodemcu/${nodemcu}/${name}/link`, { name: name });

    soilMoistureSensors = response.data.map(sensor => ({ value: sensor.port, label: sensor.port }));

}

getLightClassification = (min, max) => {
    return (max < 30 ? "Sombra" : min > 60 ? "Sol pleno" : "Meia-sombra");
}

getSoilMoistureClassification = (min, max) => {
    return (max < 30 ? "Baixa" : min > 60 ? "Alta" : "Média");
}

const PlantForm = (props, value) => {

    const [environments, setEnvironments] = useState([]);
    const [idealLigth, setIdealLigth] = useState([]);
    const [idealSoilMoisture, setIdealSoilMoisture] = useState([]);

    useEffect(() => {

        async function getSpecie() {
            specie = JSON.parse(await AsyncStorage.getItem('specie'));
            const { ideal_conditions } = specie;
            setIdealLigth(ideal_conditions.light);
            setIdealSoilMoisture(ideal_conditions.soil_moisture);
        }

        getSpecie();

        async function getEnvironments() {

            const response = await api.get('/environments');
        
            data = response.data.map(environment => ({ value: environment._id, label: environment.name }));
        
            setEnvironments(data);
            
        }
        
        getEnvironments();

        

    }, [environments]);

    return(
    <View style={styles.container}>

        {/**********************SEÇÃO DE INFORMAÇÕES BÁSICAS*************************/}
        <View style={styles.identificationSection}>
            {/*************************IMAGEM********************************************/}
            <View style={styles.imageBlock}>
                
                    <TouchableOpacity
                        onPress={async () => {
                            let result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.All,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1
                            });
                        
                            if (!result.cancelled) {
                                props.setFieldValue('thumbnail', result.uri);
                            }
                        }}
                    >
                        
                        {!props.values.thumbnail && 
                            <View style={styles.backImage}>
                                <View style={styles.backImageContent}>
                                    <FontAwesome5
                                        name={"plus-circle"}
                                        size={metrics.icon.size}
                                        color={colors.subText}
                                    /> 
                                    <Text style={styles.backImageText}>Adicionar</Text>
                                    <Text style={styles.backImageText}>Foto</Text>
                                </View>
                            </View>
                        }
                        {!!props.values.thumbnail && <Image source={{ uri: props.values.thumbnail }} style={styles.image} />}
                    </TouchableOpacity>
                
                { props.touched.thumbnail && props.errors.thumbnail && <Text style={styles.danger}>{props.errors.thumbnail}</Text> }
            </View>
            {/***************************************************************************/}
            
            {/********************************DEFINIÇÕES*************************************/}
            <View>
                {/********************************TITULO*************************************/}
                <View style={styles.title}>
                    <Text style={styles.titleText}>Definições:</Text>
                </View>
                {/***************************************************************************/}

                {/*********************************LOCAL*************************************/}
                <View>
                    <Text style={styles.labelText}>Local</Text>
                    
                    <View  style={styles.radioGroup}>
                        <RadioButton.Group
                            onValueChange={value => {
                                this.value = value;
                                props.setFieldValue('location', value);
                            }}
                            value={this.value}
                            >
                            <View style={styles.radio}>
                                <RadioButton value="Vaso" color={colors.accept}/>
                                <Text style={styles.text}>Vaso</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton value="Chão" color={colors.accept}/>
                                <Text style={styles.text}>Chão</Text>
                            </View>
                        </RadioButton.Group>
                    </View>
                    
                    { props.touched.location && props.errors.location && <Text style={styles.danger}>{props.errors.location}</Text> }
                </View>
                {/***************************************************************************/}

                {/********************************QUANTIDADE*********************************/}
                <View style={[styles.dropdownBlock, {width: metrics.halfScreen.width - 10, paddingRight: 5}]}>
                    
                    <Dropdown
                        label='Quantidade'
                        data={amounts}
                        baseColor={colors.subText}
                        fontSize={fonts.medium}
                        labelFontSize={fonts.small}
                        textColor={colors.labelText}
                        selectedItemColor={colors.text}
                        onChangeText={value => props.setFieldValue('amount', value)}
                    />
                    { props.touched.amount && props.errors.amount && <Text style={styles.amount}>{props.errors.amount}</Text> }
                
                </View>
                {/***************************************************************************/}
            </View>
            {/***************************************************************************/}
        </View>
        {/***************************************************************************/}

        {/***************************SEÇÃO DA IDENTIFICAÇÃO**********************************/}
        <View style={styles.conditionsSection}>

                <Text style={styles.titleText}>Identificação:</Text>

                {/**********************************APELIDO**********************************/}
                <View>
                    <Text style={styles.labelText}>Apelido da planta</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite um apelido..."
                        placeholderTextColor={colors.subText}
                        value={props.values.nickname}
                        onChangeText={text => props.setFieldValue('nickname', text)}
                    />
                { props.touched.nickname && props.errors.nickname && <Text style={styles.danger}>{props.errors.nickname}</Text> }
                </View>
                {/***************************************************************************/}

                {/**********************************ESPÉCIE**********************************/}
                <View>

                    <View style={styles.title}>
                        <Text style={styles.labelText}>Espécie</Text>
                    </View>

                    <View style={styles.specieItem}>
                        <Text style={styles.text}>{specie.family}: </Text>
                        <Text style={[styles.text, {color: colors.light}]}>{specie.scientific_name}</Text>
                    </View>

                    <View style={styles.specieItem}>
                        <Text style={styles.text}>Luminosidade: </Text>
                        <Text style={[styles.text, {color: colors.light}]}>{getLightClassification(idealLigth.min, idealLigth.max)} ({idealLigth.min} - {idealLigth.max}%)</Text>
                    </View>

                    <View style={styles.specieItem}>
                        <Text style={styles.text}>Umidade do solo: </Text>
                        <Text style={[styles.text, {color: colors.light}]}>{getSoilMoistureClassification(idealSoilMoisture.min, idealSoilMoisture.max)} ({idealSoilMoisture.min} - {idealSoilMoisture.max}%)</Text>
                    </View>
                    
                </View>
                {/***************************************************************************/}

        </View>
        {/***************************************************************************/}                   

        {/**************************SEÇÃO DA SINCRONIZAÇÃO***************************/}
        <View style={styles.deviceSection}>
            <Text style={styles.titleText}>Sincronização:</Text>


            {/**********************************AMBIENTE*********************************/}
            <View style={styles.dropdownBlock}>
                
                <Dropdown
                    label='Ambiente'
                    data={environments}
                    baseColor={colors.subText}
                    fontSize={fonts.medium}
                    labelFontSize={fonts.small}
                    textColor={colors.labelText}
                    selectedItemColor={colors.text}
                    onChangeText={value => {
                        props.setFieldValue('environment', value);
                        getLightSensors(value, "Luminosidade");
                        getSoilMoistureSensors(value, "Umidade do Solo");
                    }}
                />
                { props.touched.environment && props.errors.environment && <Text style={styles.danger}>{props.errors.environment}</Text> }
                
            </View>
            {/***************************************************************************/}

            {/**********************************SENSORES*********************************/}
            <View style={styles.columnBlock}>

                {/**********************************LUMINOSIDADE******************************/}
                <View style={[styles.dropdownBlock, {width: metrics.halfScreen.width - 10, paddingRight: 10}]}>
                    
                    <Dropdown
                        label='Sensor (L)'
                        data={lightSensors}
                        baseColor={colors.subText}
                        fontSize={fonts.medium}
                        labelFontSize={fonts.small}
                        textColor={colors.labelText}
                        selectedItemColor={colors.text}
                        onChangeText={value => props.setFieldValue('port1', value)}
                    />
                    { props.touched.port1 && props.errors.port1 && <Text style={styles.danger}>{props.errors.port1}</Text> }
                
                </View>
                {/***************************************************************************/}

                {/**********************************LUMINOSIDADE******************************/}
                <View style={[styles.dropdownBlock, {width: metrics.halfScreen.width - 10, paddingRight: 5}]}>
                    
                    <Dropdown
                        label='Sensor (US)'
                        data={soilMoistureSensors}
                        baseColor={colors.subText}
                        fontSize={fonts.medium}
                        labelFontSize={fonts.small}
                        textColor={colors.labelText}
                        selectedItemColor={colors.text}
                        onChangeText={value => props.setFieldValue('port2', value)}
                    />
                    { props.touched.port2 && props.errors.port2 && <Text style={styles.danger}>{props.errors.port2}</Text> }
                
                </View>
                {/***************************************************************************/}
                
            </View>
            {/***************************************************************************/}
        </View>
        {/***************************************************************************/}

        {/********************************BOTÕES*************************************/}
        <View style={styles.columnBlock}>
            <TouchableOpacity style={[styles.button, {backgroundColor: colors.accept}]} onPress={props.handleSubmit}>
                <Text style={styles.buttonText}>Concluir</Text>
            </TouchableOpacity>
        </View>
        {/***************************************************************************/}

    </View>
    );
};

const FormP = withFormik({
    mapPropsToValues: () => ({ 
        thumbnail: '',
        location: '',
        nickname: '',
        amount: 1,
        environment: '',
        port1: '',
        port2: '' 
    }),

    validationSchema: Yup.object().shape({

        thumbnail: Yup.string()
            .required('* Selecione uma imagem'),
        location: Yup.string()
            .required('* Informe o local da planta'),
        nickname: Yup.string()
            .max(20, 'Apelido deve possuir até 20 caracteres.')
            .required('* Informe um apelido.'),
        amount: Yup.number()
            .required('* Informe uma quantidade'),
        environment: Yup.string()
            .required('* Escolha um ambiente'),
        port1: Yup.string()
            .required('* Escolha uma porta'),
        port2: Yup.string()
            .required('* Escolha uma porta')
    }),

    handleSubmit: async (values, { props: { navigation, setSubmitting, setErrors} }) => {
 
        await api.put(`/nodemcu/${nodemcu}/link/${values.port1}`);

        await api.put(`/nodemcu/${nodemcu}/link/${values.port2}`);

        await api.post(`/environments/${values.environment}/plant`, {
            thumbnail: values.thumbnail,
            nickname: values.nickname,
            specie: specie._id,
            amount: values.amount,
            location: values.location,
            ports: [values.port1, values.port2]  
        })
        .then(Toast.showSuccess('Planta ' + values.nickname + ' criada!'))
        .catch(
            err => {
                setSubmitting(false);
                setErrors({ message: err.message });
        });

        await api.post('/notifications', {
            origin: `${values.nickname}criado`,
            title: `[${values.nickname}] Planta criada`,
            content: `Sensores (${values.port1},${values.port2}) vinculados.`,
        });

        navigation.navigate('Environment');

    }, 

})(PlantForm)

export default withNavigation(FormP);