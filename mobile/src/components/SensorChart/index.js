import React, { useState, useEffect } from 'react';

import { 
    Text,
    View, 
    StyleSheet, 
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import { withNavigation } from 'react-navigation';

import {
    LineChart,
} from 'react-native-chart-kit';

import styles from './styles';

function SensorChart({ title, timeData, sensorData, yAxisSuffix, chartColor, bgFrom, bgTo}) {

    const [label, setLabel] = useState('h');
    const [xAxis, setXAxis] = useState(new Array(10).fill(0));
    const [yAxis, setYaxis] = useState(new Array(10).fill(0));
    const [nDataRange, setNDataRange] = useState(10);

    const chartData = {
        labels: xAxis,
        datasets: [
          {
            data: yAxis,
            strokeWidth: 2,
          },
        ],
    };

    const [scaleButtons, setScaleButtons] = useState({
        h: true,
        d: false,
        w: false,
        m: false
    });

    useEffect(() => {

        changeChartScale(sensorData, timeData, 'h');
    
    }, [sensorData, timeData, nDataRange]);

    /*Por padrão, os dados dos sensores são recebidos a cada 1 hora*/
    changeChartScale = (hourlyDataSensor, timeData, scale) => {

        /*Constantes de tempo*/
        let hoursPerPeriod = 1;
        const hoursPerDay = 24;                        //Horas por dia
        const hoursPerWeek = hoursPerDay * 7;          //Horas por semana
        const hoursPerMonth = hoursPerDay * 31;      //Horas por mês

        let periods = [];                              //Inicialização do array temporal (períodos de tempo)
        let sensorDataPerPeriod  = [];
        let averageSensorDataPerPeriod = 0;            //Inicialização das médias de dados dos sensores

        /*Atribuição dos períodos temporaias de acordo com a escala escolhida */
        if(scale == 'd') {
            hoursPerPeriod = hoursPerDay;
        }
        else if(scale == 'w') {
            hoursPerPeriod = hoursPerWeek;
        }
        else if (scale == 'm') {
            hoursPerPeriod = hoursPerMonth;
        }
        
        /*Extraindo os períodos de tempo*/
        for(let key = 0; key < timeData.length; key++) {

            //A média só deve ser calculada se o período de tempo escolhido for diferente do horário (que já o default)
            if(scale != 'h') {

                //Cálcaulo da média para cada período de tempo
                averageSensorDataPerPeriod += hourlyDataSensor[key] / hoursPerPeriod;

                //Toda vez que fechar um ciclo completo de período
                if(key != 0 && (key % (hoursPerPeriod - 1)) == 0) {

                    //Extração de cada período de tempo correspondente ao escolhido e formatação
                    if(scale == 'd')
                        periods[(key / (hoursPerPeriod - 1)) - 1] = `${(new Date(timeData[key])).getDate()}/${(new Date(timeData[key])).getMonth() + 1}`;
                    if(scale == 'm')
                        periods[(key / (hoursPerPeriod - 1)) - 1] = `${(new Date(timeData[key])).getMonth()}/${(new Date(timeData[key])).getFullYear() + 1}`;

                    //Guardando valores das médias
                    sensorDataPerPeriod[(key / (hoursPerPeriod - 1)) - 1] = averageSensorDataPerPeriod;
                    averageSensorDataPerPeriod = 0;

                }

            }
              
            //Caso o período seja horário, basta extrair as horas
            else {
                periods[key] = (new Date(timeData[key])).getHours();
                sensorDataPerPeriod[key] = hourlyDataSensor[key];
            }

        }

        //Selecionando apenas os "nDataRange" recentes dados de cada sensor e seus respectivos períodos de tempo
        const recentSensorDataPerPeriod = sensorDataPerPeriod.slice(sensorDataPerPeriod.length - nDataRange);
        const recentPeriods = periods.slice(periods.length - nDataRange);

        //Atualizando dados no gráfico
        setLabel(scale);
        setXAxis(recentPeriods);
        setYaxis(recentSensorDataPerPeriod); 

    }

    /* Zoom In e zoom Out no gráfico*/
    changeRange = (zoom) => {
        if(zoom && nDataRange < 15)
            setNDataRange(nDataRange + 1);
        else if(!zoom && nDataRange > 5)
            setNDataRange(nDataRange - 1);
    }

    return (
        <View>     
            {/************************TÍTULO DO GRAFICO***************************
            <View style={styles.titleBlock}>
                <Text style={styles.title}>{title}</Text>
            </View>
            ********************************************************************/}

            {/*************************BOTOES DE ESCALA***************************/}

            <View style={styles.scaleSection}>

                {/******************************POR HORA******************************/}
                <TouchableOpacity 
                    style={scaleButtons.h ? styles.scaleButton : styles.scaleButtonOff} 
                    onPress={() => {
                        changeChartScale(sensorData, timeData,'h')
                        setScaleButtons({h: true, d: false, w: false, m: false})    
                    }}>
                    <Text style={scaleButtons.h ? styles.scaleButtonText : styles.scaleButtonTextOff}>
                        Horas
                    </Text>
                </TouchableOpacity>
                {/********************************************************************/}

                {/******************************POR DIA*******************************/}
                <TouchableOpacity 
                    style={scaleButtons.d ? styles.scaleButton : styles.scaleButtonOff} 
                    onPress={() => {
                        changeChartScale(sensorData, timeData,'d')
                        setScaleButtons({h: false, d: true, w: false, m: false}) 
                    }}>
                    <Text style={scaleButtons.d ? styles.scaleButtonText : styles.scaleButtonTextOff}>
                        Dias
                    </Text>
                </TouchableOpacity>
                
                {/********************************************************************/}

                {/*****************************POR SEMANA*****************************/}
                <TouchableOpacity 
                    style={scaleButtons.w ? styles.scaleButton : styles.scaleButtonOff} 
                    onPress={() => {
                        changeChartScale(sensorData,timeData,'w')
                        setScaleButtons({h: false, d: false, w: true, m: false})
                    }}>
                    <Text style={scaleButtons.w ? styles.scaleButtonText : styles.scaleButtonTextOff}>
                        Semanas
                    </Text>
                </TouchableOpacity>
                
                {/********************************************************************/}

                {/********************************POR MES*****************************/}
                <TouchableOpacity 
                    style={scaleButtons.m ? styles.scaleButton : styles.scaleButtonOff} 
                    onPress={() => {
                        changeChartScale(sensorData,timeData, 'm')
                        setScaleButtons({h: false, d: false, w: false, m: true})
                    }}>
                    <Text style={scaleButtons.m ? styles.scaleButtonText : styles.scaleButtonTextOff}>
                        Meses
                    </Text>
                </TouchableOpacity>
                {/********************************************************************/}

            </View>
            {/********************************************************************/}
                    
            {/********************************GRÁFICO*****************************/}
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 10} // from react-native
                height={220}
                yAxisSuffix={yAxisSuffix}
                xAxisLabel={label}
                chartConfig={{
                    decimalPlaces: 0,
                    backgroundGradientFrom: bgFrom,
                    backgroundGradientTo: bgTo,
                    color: (opacity = 0.37) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 2
                    }
                }}
                bezier
                style={{
                    borderRadius: 5
                }}
            />
            {/********************************************************************/}

            {/*************************BOTOES DE ZOOM*****************************/}
                <View style={styles.scaleSection}>
                    <TouchableOpacity style={styles.scaleButton}>
                        <Text style={styles.scaleButtonText} onPress={() => changeRange(true)}>(-)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scaleButton}>
                        <Text style={styles.scaleButtonText} onPress={() => changeRange(false)}>(+)</Text>
                    </TouchableOpacity>
                </View> 
            {/********************************************************************/}  

        </View>
    ); 
    
}

export default withNavigation(SensorChart);