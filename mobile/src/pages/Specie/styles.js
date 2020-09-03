import { StyleSheet } from 'react-native';
import { general, colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({
    ...general,

    description: {
        paddingTop: 10,
        paddingRight: 20,
    },

    identification: {
        backgroundColor: colors.decline,
        padding: 10,
    },

    subText: {
        color: colors.subText,
        fontSize: fonts.small,
        textAlign: 'right'
    },

    text: {
        color: colors.text,
        fontSize: fonts.regular,
    },

    classification: {
        flexDirection: 'row',
        padding: 20,
    },

    imageBlock:{
        width: metrics.halfScreen.width,
    },

    image: {
        width: metrics.previewImage.width,
        height: metrics.previewImage.height,
        borderRadius: metrics.previewImage.borderRadius
    },

    groupBlock: {
        width: metrics.halfScreen.width,
    },

    care: {
        paddingBottom: 10,
    },

    careItem: {
        flexDirection: 'row',
        marginBottom: 1,
    },

    careItemSpace: {
        paddingVertical: 10,
        width: 50
    },

    careItemTitle: {
        paddingVertical: 10,
        paddingLeft: 20,
        backgroundColor: colors.decline,
        width: metrics.halfScreen.width
    },

    careItemContent: {
        paddingVertical: 10,
        paddingRight: 20,
        backgroundColor: colors.decline,
        width: metrics.halfScreen.width - 50,
    },

    viewMore: {
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingBottom: 30,
    },

    viewMoreText: {
        color: colors.checkIcon,
        fontSize: fonts.regular,
        fontWeight: 'bold',
    },

    button: {
        height: 35,
        width: metrics.halfScreen.width - 35,
        backgroundColor: colors.accept,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        marginVertical: 15,
        marginHorizontal: 5,
        paddingVertical: 5
    },

    buttonText: {
        color: colors.light,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: fonts.regular,
    },

    buttonView: {
        height: 45,
        backgroundColor: colors.translucent,
    },
});

export default styles;