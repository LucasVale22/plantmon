import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
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

import api from '../../services/api';
import { colors, metrics, fonts } from '../../styles';

const airHumidityOptions = [{
    value: 'Escassa',
    label: 'Escassa (< 20%)',
}, {
    value: 'Baixa',
    label: 'Baixa (20 - 30%)',
}, {
    value: 'Media',
    label: 'Mediana (30 - 50%)',
}, {
    value: 'Favoravel',
    label: 'Normal (50% - 80%)',
}, {
    value: 'Alta',
    label: 'Alta (> 80%)',
}];

const temperatureOptions = [{
    value: 'Germinacao',
    label: 'Germinação (21 - 25 °C)',
}, {
    value: 'Vegetativo',
    label: 'Vegetativo (20 - 27 °C)',
}, {
    value: 'Floracao',
    label: 'Floração (20 - 29 °C)',
}, {
    value: 'Clonagem',
    label: 'Clonagem (24 - 28 °C)',
}];

temperatureSensors = [];
airHumiditySensors = [];

async function getTemperatureSensor(device, name) {

    const response = await api.get(`/nodemcu/${device}/${name}/link`, { name: name });

    temperatureSensors = response.data.map(sensor => ({ value: sensor.port, label: sensor.port }));

}

async function getAirHumiditySensors(device, name) {

    const response = await api.get(`/nodemcu/${device}/${name}/link`, { name: name });

    airHumiditySensors = response.data.map(sensor => ({ value: sensor.port, label: sensor.port }));

}

const EnvironmentForm = (props, value) => {

    const [nodemcus, setNodemcus] = useState([]);

    useEffect(() => {

        async function getNodemcus() {

            const response = await api.get('/synchronization');
        
            data = response.data.map(nodemcu => ({ value: nodemcu.device, label: nodemcu.name }));
        
            setNodemcus(data);
        }
        
        getNodemcus();

    }, [nodemcus]);
    
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
            
            {/*************************IDENTIFICAÇÃO*************************************/}
            <View>
                {/********************************TITULO*************************************/}
                <View style={styles.title}>
                    <Text style={styles.titleText}>Identificação:</Text>
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
                                <RadioButton value="Interior" color={colors.accept}/>
                                <Text style={styles.text}>Interior</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton value="Exterior" color={colors.accept}/>
                                <Text style={styles.text}>Exterior</Text>
                            </View>
                        </RadioButton.Group>
                    </View>
                    
                    { props.touched.location && props.errors.location && <Text style={styles.danger}>{props.errors.location}</Text> }
                </View>
                {/***************************************************************************/}

                {/**********************************NOME*************************************/}
                <View>
                    <Text style={styles.labelText}>Nome do ambiente</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite um nome..."
                        placeholderTextColor={colors.subText}
                        value={props.values.name}
                        onChangeText={text => props.setFieldValue('name', text)}
                    />
                { props.touched.name && props.errors.name && <Text style={styles.danger}>{props.errors.name}</Text> }
                </View>
                {/***************************************************************************/}
            </View>
            {/***************************************************************************/}
        </View>
        {/***************************************************************************/}

        {/********************SEÇÃO DAS CONDIÇÕES IDEAIS*****************************/}
            <View style={styles.conditionsSection}>
                <Text style={styles.titleText}>Condições ideais:</Text>

                {/****************************TEMPERATURA************************************/}
                <View style={styles.dropdownBlock}>

                    <Dropdown
                        label='Temperatura'
                        data={temperatureOptions}
                        baseColor={colors.subText}
                        fontSize={fonts.medium}
                        labelFontSize={fonts.small}
                        textColor={colors.labelText}
                        selectedItemColor={colors.text}
                        onChangeText={value => props.setFieldValue('temperature', value)}
                    />
                    { props.touched.temperature && props.errors.temperature && <Text style={styles.danger}>{props.errors.temperature}</Text> }
                
                </View>
                {/***************************************************************************/}

                {/****************************UMIDADE DO AR**********************************/}
                <View style={styles.dropdownBlock}>

                    <Dropdown
                        label='Umidade do Ar'
                        data={airHumidityOptions}
                        baseColor={colors.subText}
                        fontSize={fonts.medium}
                        labelFontSize={fonts.small}
                        textColor={colors.labelText}
                        selectedItemColor={colors.text}
                        onChangeText={value => props.setFieldValue('air_humidity', value)}
                    />
                    { props.touched.air_humidity && props.errors.air_humidity && <Text style={styles.danger}>{props.errors.air_humidity}</Text> }
                
                </View>
                {/***************************************************************************/}
            </View>
        {/***************************************************************************/}                   

        {/**************************SEÇÃO DOS DISPOSITIVOS***************************/}
        <View style={styles.deviceSection}>
            <Text style={styles.titleText}>Dispositivos:</Text>


            {/**********************************NODEMCU**********************************/}
            <View style={styles.dropdownBlock}>
                
                <Dropdown
                    label='NodeMCU'
                    data={nodemcus}
                    baseColor={colors.subText}
                    fontSize={fonts.medium}
                    labelFontSize={fonts.small}
                    textColor={colors.labelText}
                    selectedItemColor={colors.text}
                    onChangeText={value => {
                        props.setFieldValue('nodemcu', value);
                        getTemperatureSensor(value, "Temperatura", );
                        getAirHumiditySensors(value, "Umidade do Ar")
                    }}
                />
                { props.touched.nodemcu && props.errors.nodemcu && <Text style={styles.danger}>{props.errors.nodemcu}</Text> }
                
            </View>
            {/***************************************************************************/}

            {/**********************************SENSORES*********************************/}
            <View style={styles.columnBlock}>
                
                {/**********************************TEMPERATURA******************************/}
                <View style={[styles.dropdownBlock, {width: metrics.halfScreen.width - 10, paddingRight: 10}]}>
                    
                    <Dropdown
                        label='Sensor (T)'
                        data={temperatureSensors}
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

                {/*********************************UMIDADE DO AR*****************************/}
                <View style={[styles.dropdownBlock, {width: metrics.halfScreen.width - 10, paddingRight: 5}]}>
                    
                    <Dropdown
                        label='Sensor (UA)'
                        data={airHumiditySensors}
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

const Form = withFormik({
    mapPropsToValues: () => ({ 
        thumbnail: '', 
        name: '', 
        location: '', 
        temperature: '',
        air_humidity: '',
        nodemcu: '',
        port1: '',
        port2: '' 
    }),

    validationSchema: Yup.object().shape({

        thumbnail: Yup.string()
            .required('* Selecione uma imagem'),
        name: Yup.string()
            .max(20, 'Nome deve possuir até 20 caracteres.')
            .required('* Informe um nome.'),
        location: Yup.string()
            .required('* Informe o tipo de ambiente'),
        temperature: Yup.string()
            .required('* Selecione uma faixa de temperatura'),
        air_humidity: Yup.string()
            .required('* Selecione uma faixa de  umidade do ar'),
        nodemcu: Yup.string()
            .required('* Escolha um dispositivo'),
        port1: Yup.string()
            .required('* Escolha uma porta'),
        port2: Yup.string()
            .required('* Escolha uma porta')

    }),

    handleSubmit: async (values, { props: { navigation, setSubmitting, setErrors} }) => {

        await api.put(`/synchronization/${values.nodemcu}`, { connected: true });

        await api.put(`/nodemcu/${values.nodemcu}/link/${values.port1}`);

        await api.put(`/nodemcu/${values.nodemcu}/link/${values.port2}`);

        await api.post('/environments', {
                thumbnail: values.thumbnail, 
                name: values.name, 
                location: values.location, 
                temperature: values.temperature,
                air_humidity: values.air_humidity,
                nodemcu: values.nodemcu,
                ports: [values.port1, values.port2] 
            })
            .then(Toast.showSuccess('Ambiente ' + values.name + ' criado!'))
            .catch(err => {
                setSubmitting(false);
                setErrors({ message: err.message });
            });

        await api.post('/notifications', {
                origin: `${values.name}criado`,
                title: `[${values.name}] Ambiente criado`,
                content: `Dispositivo ${values.nodemcu} sincronizado e sensores (${values.port1},${values.port2}) vinculados.`,
        });
        
        navigation.navigate('Garden');

    },

})(EnvironmentForm)

export default withNavigation(Form);