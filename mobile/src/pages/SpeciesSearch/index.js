import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import { Image } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import { colors, metrics, fonts } from '../../styles';

import api from '../../services/api';

export default function SpeciesSearch({navigation}) {

  const [species, setSpecies] = useState([]);
  const [inMemorySpecies, setInMemorySpecies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    setIsLoading(true);

    async function loadSpecies () {

      const response = await api.get('/species');
  
      let data = response.data;
  
      data = Object.keys(data).map(function(key) {
  
          return data[key];
        });

      setSpecies(data);
      setInMemorySpecies(data);
      setIsLoading(false);
    }

    loadSpecies();

  }, []);

  async function handleDisplay(specie, uri_image) {

    await AsyncStorage.multiSet([
      ['specie', JSON.stringify(specie)],
      ['uri_image', uri_image]
    ]);

    //await AsyncStorage.setItem('specie', JSON.stringify(specie));

    navigation.navigate('Specie');
}

  renderItem = ({ item }) => (

    
    <TouchableOpacity onPress={() => {handleDisplay(item, item.uri_image)}}>

      <View style={styles.listItem}>

        <View style={styles.description}>
          <Text style={styles.popularName}>
            {item.popular_name.split(',', 1)[0]}
          </Text>
          <Text style={styles.scientificName}>
            {item.scientific_name}
          </Text>
        </View>

          <View style={styles.thumbnail}>
            <Image   
              style={styles.image}
              source={{uri: item.uri_image}}
              PlaceholderContent={<ActivityIndicator/>}
              borderRadius={50}
            />  
          </View>

      </View>
    </TouchableOpacity>
  );

  searchSpecies = value => {
    const filteredSpecies = inMemorySpecies.filter(specie => {
      let specieLowercase = (
        specie.popular_name
      ).toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return specieLowercase.indexOf(searchTermLowercase) > -1;
    });
    setSpecies(filteredSpecies);
  };

  
    return (
      <SafeAreaView style={styles.container}>
        
        <View style={styles.searchBarView}>
          <View style={styles.leftSideSearchBar}>
            <FontAwesome5
              name={"search"}
              size={metrics.icon.size}
              color={colors.decline}
            />
          </View>

          <TextInput
            placeholder="Digite um nome popular..."
            placeholderTextColor={colors.subText}
            style={styles.searchBar}
            onChangeText={value => searchSpecies(value)}
          />
        </View>

        <View style={styles.listView}>
          
          {isLoading ? (
            <View>
              <ActivityIndicator size="large" color="#bad555" />
            </View>
          ) : (
          
          <FlatList
            data={species}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View
                style={styles.listItem}
              >
                <Text style={styles.notFound}>* Nenhuma espécie encontrada!</Text>
              </View>
            )}
          />
        )}
        </View>
      

      </SafeAreaView>
    );
  
}

