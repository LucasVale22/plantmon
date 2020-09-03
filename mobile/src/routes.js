import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { colors, metrics } from './styles';

import Garden from './pages/Garden';

import NewEnvironment from './pages/NewEnvironment';
import Plant from './pages/Plant';
import Environment from './pages/Environment';
import SensorHistory from './pages/SensorHistory'
import NewPlant from './pages/NewPlant';
import SpeciesSearch from './pages/SpeciesSearch';
import Specie from './pages/Specie';
//import Settings from './pages/Settings';
import Devices from './pages/Devices';
import Notifications  from './pages/Notifications';

const GardenStack = createStackNavigator({
    Garden: {
      screen: Garden,
      navigationOptions: (props) => {
            const { navigation } = props;
            return ({
                headerTitle: 'Meu Jardim',
                headerStyle: {
                    backgroundColor: colors.header,
                },
                headerTitleStyle: {
                    color: colors.light,
                },
                headerRight: <View style={{paddingRight: 15}}>
                <TouchableOpacity onPress={() => navigation.navigate('NewEnvironment')}>
                    <FontAwesome5
                        name={"plus-circle"}
                        size={metrics.icon.size}
                        color={colors.light}
                    /> 
                </TouchableOpacity>
                </View>
            })
      },
    },
    NewEnvironment: {
        screen: NewEnvironment,
        navigationOptions: {
            title: 'Novo Ambiente',
            headerStyle: {
            backgroundColor: colors.header,
            },
            headerTitleStyle: {
                color: colors.light,
            }
        },
    },
    Environment: {
        screen: Environment,
        navigationOptions: ({ navigation }) => ({
            
            title: navigation.getParam('name'),
            headerStyle: {
                backgroundColor: colors.header,
            },
            headerTitleStyle: {
                color: colors.light,
            }
        })
    },
    Plant: {
        screen: Plant,
        navigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: colors.header,
                height: 40,
                elevation: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                color: colors.light,
                paddingLeft: 0
            },
            headerLeft: (
                <TouchableOpacity onPress={() => {navigation.pop()}}>
                    <View style={{paddingLeft: 15}}>
                        <FontAwesome5 
                            name={"angle-left"} 
                            size={metrics.icon.size}
                            color={colors.light}
                        />
                    </View>
                </TouchableOpacity>
            ),
            
        })
    },
    SensorHistory: {
        screen: SensorHistory,
        navigationOptions: ({ navigation }) => ({
            title: `Histórico de ${navigation.getParam('name')}`,
            headerStyle: {
                backgroundColor: colors.header,
            },
            headerTitleStyle: {
                color: colors.light,
            }
        })
    },
});

const NotificationsStack = createStackNavigator({
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        headerTitle: 'Avisos de atividades',
        headerStyle: {
            backgroundColor: colors.header
        },
        headerTitleStyle: {
            color: colors.light,
        }
      },
    },
});

const SpeciesSearchStack = createStackNavigator({
    SpeciesSearch: {
        screen: SpeciesSearch,
        navigationOptions: {
            headerTitle: 'Busca de espécies',
            headerStyle: {
                backgroundColor: colors.header,
            },
            headerTitleStyle: {
                color: colors.light,
            }
        },
    },
    Specie: {
        screen: Specie,
        navigationOptions: ({ navigation }) => ({
            title: 'Informações',
            headerStyle: {
                backgroundColor: colors.header,
            },
            headerTitleStyle: {
                color: colors.light,
            }
        })
    },
    NewPlant: {
        screen: NewPlant,
        navigationOptions: {
            headerTitle: 'Nova Planta',
            headerStyle: {
                backgroundColor: colors.header,
            },
            headerTitleStyle: {
                color: colors.light,
            }
        },  
    },
});

/*const SettingsStack = createStackNavigator({
    Settings: {
      screen: Settings,
      navigationOptions: {
        headerTitle: 'Opções de configuração',
        headerStyle: {
            backgroundColor: colors.header,
        },
        headerTitleStyle: {
            color: colors.light,
        }
      },
    },
});*/

const DevicesStack = createStackNavigator({
    Devices: {
      screen: Devices,
      navigationOptions: {
        headerTitle: 'Conexões de dispositivos',
        headerStyle: {
            backgroundColor: colors.header
        },
        headerTitleStyle: {
            color: colors.light,
        }
      },
    },
});

const MainTabs = createBottomTabNavigator(

    {
        Garden: {
            screen: GardenStack,
            navigationOptions: {
                tabBarLabel: 'Início',
            },
        },
        Notifications: {
            screen: NotificationsStack,
            navigationOptions: {
                tabBarLabel: 'Avisos',
            },
        },
        SpeciesSearch: {
            screen: SpeciesSearchStack,
            navigationOptions: {
                tabBarLabel: 'Busca',
            },
        },
        /*Settings: {
            screen: SettingsStack,
            navigationOptions: {
                tabBarLabel: 'Opções',
            },
          },*/
        Devices: {
            screen: DevicesStack,
            navigationOptions: {
                tabBarLabel: 'Conexões',
            },
        },
    },

    {
        tabBarOptions: {
            style: {
                backgroundColor: colors.header,
            },
            activeTintColor: colors.light, 
            inactiveTintColor: colors.dark,
            showLabel: true,
        },
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = FontAwesome5;
                let iconName;

                if(routeName === "Garden")
                    iconName = 'home';
                if(routeName === "Notifications")
                    iconName = 'bell';
                else if(routeName === "SpeciesSearch")
                    iconName = 'search';
                /*else if(routeName === "Settings")
                    iconName = 'cog';*/
                else if(routeName === "Devices")
                    iconName = 'sitemap';

                return (
                    <IconComponent
                        name={iconName}
                        size={metrics.icon.size}
                        color={tintColor}
                    />
                );
            }
        })
    },

);

const Routes = createAppContainer(
    createSwitchNavigator({
        MainTabs,
    }),
);

export default Routes;