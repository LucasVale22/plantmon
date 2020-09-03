import { StyleSheet } from 'react-native';
import { colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({

    titleBlock: {
        backgroundColor: colors.subView,
        width: metrics.halfScreen.width,
        padding: 15,
        marginVertical: 20
    },

    title: {
        fontSize: fonts.medium,
        fontStyle: 'italic',
    },

    scaleButton: {
        width: (metrics.device.width - 10) / 4 - 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: colors.accept
    },

    scaleButtonText: {
        color: colors.light,
        fontSize: fonts.regular
    },

    scaleButtonOff: {
        width: (metrics.device.width - 10) / 4 - 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },

    scaleButtonTextOff: {
        color: colors.text,
        fontSize: fonts.regular
    },

    scaleSection: {
        backgroundColor: colors.decline,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5
    }
});

export default styles;