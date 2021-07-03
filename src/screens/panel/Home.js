import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableNativeFeedback, Alert } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import randomColor from 'randomcolor';
import Loading from '../Loading';
import Border from '../components/Border';

const style = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    title: { fontSize: 25, fontWeight: 'bold', marginBottom: 10 },
    classCard: {
        flex: 1, flexDirection: 'row',
        backgroundColor: '#1abc9c', padding: 15, marginTop: 10, borderRadius: 10,
    },
    classSubtitle: { color: '#fff' },
    classTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});

class Home extends React.Component {
    state = { ready: false, loading: false, newClass: '', rooms: [] };
    componentDidMount() {
        this.fetch();
    }
    async onAdd() {
        const { models } = this.props;
        const { newClass } = this.state;
        this.setState({ loading: true });
        const room = await models.Room.create({ name: newClass });
        this.setState({ loading: false }, this.fetch.bind(this));
    }
    async fetch() {
        const { models } = this.props;
        this.setState({ ready: false });
        const rooms = await models.Room.collection();
        this.setState({ ready: true, rooms: rooms.rows });
    }
    render() {
        const { newClass, rooms, ready, loading } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>Beranda</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ flex: 9, }}>
                            <Input value={newClass} onChangeText={(t) => this.setState({ newClass: t })} containerStyle={{ margin: 0, padding: 0 }} placeholder="Kelas baru" />
                        </View>
                        <View style={{ flex: 1, paddingTop: 10, alignItems: 'flex-end' }}>
                            <Icon name="add" onPress={this.onAdd.bind(this)} size={15} color="#16a085" raised />
                        </View>
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                        {ready ? (
                            rooms.length ? (
                                rooms.map((r, i) => (
                                    <TouchableNativeFeedback style={{ borderRadius: 10 }} key={i}>
                                        <View style={[style.classCard, { marginTop: i === 0 ? 0 : 10 }, { backgroundColor: randomColor({ luminosity: 'dark', format: 'rgba', alpha: 0.7, seed: r.id }) }]}>
                                            <View style={{ flex: 3 }}>
                                                <Text style={style.classTitle}>{r.name}</Text>
                                                <Text style={style.classSubtitle}>{r.participants.length} peserta</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Icon name="chevron-right" color="#fff" />
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                ))
                            ) : (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 15 }}>Kelas kosong. Tambah kelas baru <Icon name="arrow-upward" /></Text>
                                </View>
                            )
                        ) : (
                            <Loading />
                        )}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default Home;