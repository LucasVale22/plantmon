import colors from './colors';
import metrics from './metrics';
import fonts from './fonts'

const general = {
    container: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light,
        paddingBottom: metrics.safeArea.paddingBottom,
    },
    
    containerSubtitle: {
        flex: 1,
        backgroundColor: colors.light,
        width: metrics.device.width,
        height: metrics.subtitle.height,
        paddingTop: metrics.subtitle.paddingTop,
        paddingBottom: metrics.subtitle.paddingBottom,
        paddingLeft: metrics.subtitle.paddingLeft,
        marginBottom: metrics.subtitle.marginBottom
    },
    subtitle: {
        color: colors.text,
        fontSize: fonts.regular,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: colors.subView,
        width: metrics.preview.width,
        flexDirection: 'column',
        marginVertical: 5,
        //flexWrap: 'wrap',
        //alignContent: 'space-between',
    },

    previewTopBlock: {
        flexDirection: 'row',
        marginTop: metrics.preview.topBlockMarginTop,
        marginBottom: metrics.preview.topBlockMarginBottom,
    },

    previewBottomBlock: {
        flexDirection: 'row',
        marginBottom: 15,
    },

    previewImageSection: {
        width: metrics.halfScreen.width,
        marginLeft: metrics.previewImageSection.marginLeft,
    },

    previewDescriptionSection: {
        width: metrics.halfScreen.width,
    },

    previewTitleContainer: {
        backgroundColor: colors.decline,
        paddingLeft: 10,
        paddingVertical: 10,
    },

    previewName: {
        color: colors.text,
        fontSize: fonts.regular,
    },

    previewLocation: {
        color: colors.subText,
        fontSize: fonts.small,
        fontStyle: 'italic',
    },

    previewTextStatus: {
        flexDirection: 'row',
        paddingTop: 15,
    },
    previewStatus: {
        fontSize: fonts.small,
        color: colors.subText,
        textAlignVertical: 'center',
    },
    
    previewNumericStatus: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: colors.decline,
        justifyContent: 'space-between',
    },

    statusItemView: {
        paddingHorizontal: 15,
        flexDirection: 'row',
    },

    statusItemText: {
        color: colors.checkIcon,
    },

    previewSync: {
        alignItems: 'center',
        paddingLeft: 10,
    },

    textSync: {
        color: colors.subText,
        fontSize: fonts.small
    },
}

export default general;