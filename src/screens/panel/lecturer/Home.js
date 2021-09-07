import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableNativeFeedback, Alert } from 'react-native';
import { ListItem, Icon, Input } from 'react-native-elements';
import randomColor from 'randomcolor';
import Loading from '../../Loading';
import Border from '../../../components/Border';

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
        this.setState({ loading: false, newClass: '' }, this.fetch.bind(this));
    }
    async fetch() {
        console.log('fetch');
        const { models } = this.props;
        this.setState({ ready: false });
        const rooms = await models.Room.collection();
        this.setState({ ready: true, rooms: rooms.rows });
    }
    render() {
        const { navigation } = this.props;
        const { newClass, rooms, ready, loading } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>Daftar Kelas</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ flex: 8, }}>
                            <Input value={newClass} onChangeText={(t) => this.setState({ newClass: t })} errorStyle={{ display: 'none' }} containerStyle={{ margin: 0, padding: 0 }} inputStyle={{ fontSize: 20 }} placeholder="Kelas baru" />
                        </View>
                        <View style={{ flex: 1, paddingTop: 10, alignItems: 'flex-end' }}>
                            <Icon name="add" disabled={loading || !newClass} onPress={this.onAdd.bind(this)} size={20} raised />
                        </View>
                    </View>
                    <View>
                        {ready ? (
                            rooms.length ? (
                                rooms.map((r, i) => (
                                    <ListItem Component={TouchableNativeFeedback} onPress={() => navigation.navigate('Room', { room: r, refreshHome: this.fetch.bind(this) })} key={i} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontWeight: 'bold', fontSize: 20 }}>{r.name}</ListItem.Title>
                                            <ListItem.Subtitle style={{ fontSize: 20 }}>{r.participants.length} peserta, {r.tasks.length} tugas</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                ))
                            ) : (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Kelas kosong. Tambah kelas baru</Text>
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