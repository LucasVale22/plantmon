import { StyleSheet } from 'react-native';
import { colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({

    alertContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 1.7 * metrics.halfScreen.width,
        marginTop: 15,
        padding: 7,
        paddingLeft: 15,
    },

    alertText: {
        fontSize: fonts.big,
        color: colors.light
    },

    reportContainer: {
        width: 1.7 * metrics.halfScreen.width, 
        padding: 7,
        paddingLeft: 15,
        backgroundColor: colors.subView
    },

    reportText: {
        fontSize: fonts.medium,
        color: colors.text
    }

});

export default styles;