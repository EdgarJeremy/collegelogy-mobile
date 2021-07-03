import React from 'react';
import { View, Text } from 'react-native';
import { Icon, Button } from 'react-native-elements';

class Error extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Icon name="error" />
                <Text style={{ textAlign: 'center' }}>Tidak dapat terkoneksi ke server!</Text>
                <Button onPress={this.props.retry} buttonStyle={{ alignSelf: 'center', marginTop: 20 }} icon={{ name: 'sync', color: '#fff' }} title="Coba lagi" />
            </View>
        )
    }
}

export default Error;