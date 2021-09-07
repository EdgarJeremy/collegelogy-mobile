import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

import 'moment/locale/id';

const style = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    title: { fontSize: 25, fontWeight: 'bold', marginBottom: 10 },
    classCard: {
        flex: 1, flexDirection: 'row',
        backgroundColor: '#1abc9c', padding: 15, marginTop: 10, borderRadius: 10,
    },
    classSubtitle: { color: '#fff' },
    classTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});

class DocDiffs extends React.Component {
    state = {
    };
    render() {
        const { route } = this.props;
        const { params: { diff, from, to } } = route;
        const Co = () => (
            <Text>
                {diff.map((d, i) => (
                    <Text key={i} style={{
                        color: (() => {
                            // const color = !d.added && !d.removed ? 'green' : 'black';
                            const color = d.added ? '#3498db' : (d.removed ? '#e74c3c' : '#2ecc71');
                            return color;
                        })(),
                        fontSize: 20
                    }}>
                        {d.value}
                    </Text>
                ))}
            </Text>
        );
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ padding: 10 }}>
                    <Text style={[style.title, { paddingBottom: 0, fontSize: 20 }]}>{from.toUpperCase()} → {to.toUpperCase()}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 30, height: 30, backgroundColor: '#2ecc71', marginRight: 10 }}></View>
                        <Text style={{ color: '#2ecc71', fontSize: 20 }}>Teks yang sama</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 30, height: 30, backgroundColor: '#3498db', marginRight: 10 }}></View>
                        <Text style={{ color: '#3498db', fontSize: 20 }}>Teks yang ditambah</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 30, height: 30, backgroundColor: '#e74c3c', marginRight: 10 }}></View>
                        <Text style={{ color: '#e74c3c', fontSize: 20 }}>Teks yang dihilangkan</Text>
                    </View>
                </View>
                <Divider />
                <View style={style.container}>
                    <Co />
                </View>
            </ScrollView>
        )
    }
}

export default DocDiffs;