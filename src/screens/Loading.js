import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

class Loading extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', marginTop: 10 }}>
                <Text style={{ textAlign: 'center', fontSize: 20 }}>Menghubungi server...</Text>
                <ActivityIndicator size="large" color="#16a085" />
            </View>
        )
    }
}

export default Loading;