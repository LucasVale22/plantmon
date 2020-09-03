import { StyleSheet } from 'react-native';
import { general, colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({

    nickname: {
        color: colors.light,
        fontSize: fonts.big,
    },

    scientificName: {
        color: colors.light,
        fontSize: fonts.small,
        fontStyle: 'italic',
    },

    headerExtension: {
        backgroundColor: colors.header,
        width: metrics.device.width,
        height: 60,
        paddingLeft: 15
    },

    image: {
        width: metrics.previewImage.width + 20,
        height: metrics.previewImage.height + 20,
        borderRadius: metrics.previewImage.borderRadius + 20
    },

    imageBlock:{
        flex: 1,
        position: 'absolute',
        //marginTop: 10,
        width: general.previewContainer.width,
        paddingLeft: metrics.halfScreen.width

    },

    initialBlock: {
        marginTop: 10
    },

    detailsBlock: {
        //marginTop: 10,
        marginBottom: 10,
        //width: general.previewContainer.width
    },

    titleView: {
        paddingLeft: 15,
        marginBottom: 15,
    },

    detaislTitle: {
        color: colors.subText,
        fontSize: fonts.medium,
        fontStyle: 'italic',
    },

    details: {
        marginVertical: 5,
    },

    property: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginBottom: 4,
        padding: 7,
        paddingLeft: 15,
        backgroundColor: colors.subView
    },
    propertyName: {
        marginRight: 40
    },

    propertyContent: {

    },

    text: {
        color: colors.text,
        fontSize: fonts.regular
    },

    subText: {
        color: colors.subText,
        fontSize: fonts.small
    },

    statusSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40
    },

    statusNumber: {
        fontSize: fonts.big,
        fontWeight: 'bold'
    },

    statusItem: {
        //justifyContent: 'space-between'
    }

});

export default styles;