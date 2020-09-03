import { StyleSheet } from 'react-native';
import { general, metrics, colors, fonts } from '../../styles';

const styles = StyleSheet.create({
    ...general,

    deviceBlock: {
        flex: 1,
        marginTop: 5,
        width: metrics.device.width
    },

    nodemcuSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.subView,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    nodemcuId: {
        width: metrics.halfScreen.width,
        marginRight: 110
    },

    nodemcuName: {
        flex: 1,
        fontSize: fonts.regular,
        color: colors.text,
    },
    
    nodemcuDevice: {
        flex: 1,
        fontSize: fonts.small,
        color: colors.subText,
    },

    nodemConn: {
        width: metrics.halfScreen.width,
        alignSelf: 'center',
    },

    subItemFlatList: {
        flexDirection: 'row',
        padding: 10,
    },

    sensorsContainer: {
        borderBottomColor: colors.decline,
        borderBottomWidth: 4,
        borderLeftColor: colors.decline,
        borderLeftWidth: 4,
        borderRightColor: colors.decline,
        borderRightWidth: 4,
    },

    barAfterOpen: {
        backgroundColor: colors.decline,
        height: 24,
        alignItems: 'center' 
    },

    sensorsButtonsSection: {
        paddingRight: 25,
    },

    sensorPort: {
        flexDirection: 'row',
    },

    sensorIcon: {
        paddingLeft: 10,
        alignItems: 'center',
    }

});

export default styles;