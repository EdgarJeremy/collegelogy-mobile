import { Alert } from 'react-native';

const error = function (e, utility) {
    console.log(e);
    if (e.response) {
        if (utility)
            utility.handleTokenRenewal(e.response);
        if (e.response.data) {
            if (e.response.data.errors) {
                if (e.response.data.errors.length)
                    return Alert.alert('Terjadi Kesalahan', e.response.data.errors.map((e) => e.msg + '\n').join());
            }
        }
        return Alert.alert('Terjadi Kesalahan', JSON.stringify(e.response.data));
    } else {
        if (e.errors) {
            if (e.errors.length) {
                return Alert.alert('Terjadi Kesalahan', e.errors.map((e) => e.msg).join());
            }
            if (e.errors.errors) {
                if (e.errors.errors.length) {
                    return Alert.alert('Terjadi Kesalahan', e.errors.errors.map((e) => e.msg).join());
                }
            }
        }
        return Alert.alert('Terjadi Kesalahan', JSON.stringify(e));
    };
}

export default error;