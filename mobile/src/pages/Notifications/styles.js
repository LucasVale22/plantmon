import { StyleSheet } from 'react-native';
import { general, colors, metrics, fonts } from '../../styles';

const styles = StyleSheet.create({

    listItem: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.subView,
        marginTop: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    title: {
        flex: 1,
        fontSize: fonts.regular,
        color: colors.text,
    },

    content: {
        flex: 1,
        fontSize: fonts.small,
        color: colors.subText,
    },

    thumbnail: {
        justifyContent: 'flex-end', 
        paddingLeft: 50 
    },

    message: {
        width: 1.6 * metrics.halfScreen.width
    },

    date: {
        width: 0.4 * metrics.halfScreen.width
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