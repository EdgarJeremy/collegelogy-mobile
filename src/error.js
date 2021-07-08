import { Alert } from 'react-native';

const error = function (e, utility) {
    if (e.response) {
        utility.handleTokenRenewal(e.response);
        if (e.response.data) {
            if (e.response.data.errors) {
                if (e.response.data.errors.length)
                    return Alert.alert('Terjadi Kesalahan', e.response.data.errors.map((e) => e.msg + '\n').join());
            }
        }
        return Alert.alert('Terjadi Kesalahan', JSON.stringify(e.response.data));
    } else return Alert.alert('Terjadi Kesalahan', e.message);
}

export default error;