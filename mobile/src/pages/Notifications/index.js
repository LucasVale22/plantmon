import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import Swipeout from 'react-native-swipeout';

import api from '../../services/api';

import styles from './styles';

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        setIsLoading(true);

        async function loadNotifications () {

        const response = await api.get('/notifications');
    
        let data = response.data;
    
        data = Object.keys(data).map(function(key) {
    
            return data[key];
            });

        setNotifications(data);
        setIsLoading(false);
        }

        loadNotifications();

    }, []);

    swipeoutBtns = [
        {
          text: 'Excluir'
        }
      ];

    renderItem = ({ item }) => (

       

        <Swipeout right={swipeoutBtns} onPress={() => {console.log("excluiiu")}}>
        <View style={styles.listItem}>
    
            <View style={styles.message}>
              <Text style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.content}>
                {item.content}
              </Text>
            </View>
    
            <View style={styles.date}>
                <Text></Text>
                <Text style={styles.content}>
                    {`${(new Date(item.createdAt)).getHours()}:${(new Date(item.createdAt)).getMinutes()}h`}
                </Text>
            </View>
    
          </View>
          </Swipeout>
      );

    return (

        <SafeAreaView>

            <View>
          
            {isLoading ? (
                <View>
                    <ActivityIndicator size="large" color="#bad555" />
                </View>
            ) : (
            
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                <View
                    style={styles.listItem}
                >
                    <Text style={styles.notFound}>* Você não tem nenhunha notificação</Text>
                </View>
                )}
            />
            )}
            </View>
        </SafeAreaView>

    );
}