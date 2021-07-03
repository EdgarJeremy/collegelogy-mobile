import React from 'react';
import { View } from 'react-native';

function Border({ width = 30, margin = 0, color = '#000' }) {
    return (
        <View style={{ width: 30, marginTop: margin, backgroundColor: color, height: 3 }}></View>
    )
}

export default Border;