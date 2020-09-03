import { StyleSheet } from 'react-native';
import { general, colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({
    ...general,

    searchBarView: {
        flexDirection: 'row'
    },

    searchBar: {
        alignSelf: 'stretch',
        backgroundColor: colors.light,
        paddingHorizontal: 10,
        fontSize: fonts.medium,
        height: 60,
        width: metrics.device.width - 60,
        marginBottom: 5,
        marginTop: 5,
        borderWidth: 8,
        borderLeftWidth: 0,
        borderColor: colors.decline,
    },

    leftSideSearchBar: {
        alignItems: 'center',
        backgroundColor: colors.light,
        paddingHorizontal: 10,
        paddingTop: 10,
        height: 60,
        width: 60,
        marginBottom: 5,
        marginTop: 5,
        borderWidth: 8,
        borderRightWidth: 0,
        borderColor: colors.decline,
    },

    listView: {
        flex: 1,
        width: metrics.preview.width,
        marginTop: 5,
    },

    listItem: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.subView,
        marginTop: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

      popularName: {
        flex: 1,
        fontSize: fonts.regular,
        color: colors.text,
    },
    
      scientificName: {
        flex: 1,
        fontSize: fonts.small,
        color: colors.subText,
    },

    thumbnail: {
        justifyContent: 'flex-end', 
        paddingLeft: 50 
    },

    description: {
        width: metrics.halfScreen.width + 50
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 50
    },

    loadingView: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(23, 116, 6, 0.25)',
        alignItems: 'center',
        justifyContent: 'center'
      },
    
      notFound: {
        fontSize: fonts.medium,
        color: colors.danger,
      }
});

export default styles;