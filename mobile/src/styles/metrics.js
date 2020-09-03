import { Dimensions } from 'react-native';
import { Header } from 'react-navigation-stack';

const metrics = {

    device: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    halfScreen: {
        width: Dimensions.get('window').width / 2,
    },

    safeArea: {
        paddingBottom: 15,
    },

    subtitle : {
        height: 0,
        paddingTop: 8,
        paddingBottom: 10,
        paddingLeft: 25,
        marginBottom: 10,
    },
    
    preview: {
        width: Dimensions.get('window').width,
        marginTop: 10,
        marginHorizontal: 5,
        topBlockMarginTop: 15,
        topBlockMarginBottom: 15,
    },

    icon: {
        size: 24,
        marginRight: 10,
    },

    smallIcon: {
        size: 16,
    },

    previewImageSection: {
        marginLeft: 15,
    },    
    previewImage: {
        width: 150,
        height: 150,
        borderRadius: 150,
    },
   
}

export default metrics;