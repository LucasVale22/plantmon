import { StyleSheet } from 'react-native';
import { colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({
    identificationSection: {
        marginTop: 20,
        flexDirection: 'row',
    },
    imageBlock: {
        width: (metrics.halfScreen.width - 0.12 * metrics.halfScreen.width),
        marginLeft: metrics.previewImageSection.marginLeft - 5,
    },
    backImage: {
        width: metrics.previewImage.width,
        height: metrics.previewImage.height,
        backgroundColor: colors.subView,
        borderRadius: metrics.previewImage.borderRadius,
        paddingTop: 45,
    },
    backImageContent: {
        alignItems: 'center',
    },

    backImageText: {
        fontSize: fonts.small,
        color: colors.subText,
    },

    image: {
        width: metrics.previewImage.width,
        height: metrics.previewImage.height,
        borderRadius: metrics.previewImage.borderRadius,
    },

    title: {
        marginBottom: 5,
    },

    titleText: {
        color: colors.text,
        fontStyle: 'italic',
        fontSize: fonts.regular,
    },

    text: {
        color: colors.text,
        fontSize: fonts.medium,
    },

    labelText: {
        color: colors.subText,
        fontSize: fonts.small,
    },

    radioGroup: {
        flexDirection: 'row',
    },

    radio: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    conditionsSection: {
        marginTop: 10,
        marginHorizontal: 10
    },
    input: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.subText,
        paddingHorizontal: 10,
        fontSize: fonts.medium,
        height: 35,
        marginBottom: 20,
    },

    specieItem: {
        flexDirection: 'row',
        width: metrics.device.width - 40,
        height: 30,
        marginHorizontal: 10,
        marginVertical: 1,
        padding: 5,
        backgroundColor: colors.subView
    },

    dropdownBlock: {
        marginTop: -10
    },

    deviceSection: {
        marginTop: 10,
        marginHorizontal: 10
    },

    columnBlock: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    temperatureValue: {
        alignSelf: 'center',
        fontWeight: 'bold',
    },

    danger: {
        color: colors.danger,
        fontSize: fonts.tiny,
        paddingBottom: 15,
    },

    button: {
        height: 35,
        width: metrics.halfScreen.width - 35,
        backgroundColor: colors.decline,
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


});

export default styles;