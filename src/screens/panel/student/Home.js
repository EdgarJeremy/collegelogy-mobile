import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableNativeFeedback, Alert } from 'react-native';
import { ListItem, Icon, Input } from 'react-native-elements';
import randomColor from 'randomcolor';
import Loading from '../../Loading';
import Border from '../../../components/Border';
import error from '../../../error';

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
    state = { ready: false, loading: false, classCode: '', rooms: [] };
    componentDidMount() {
        this.fetch();
    }
    async onAdd() {
        const { models } = this.props;
        const { classCode } = this.state;
        this.setState({ loading: true });
        try {
            const r = await models.Room.$http(`rooms/${classCode}/join`, 'POST');
            Alert.alert('Konfirmasi', `Selamat bergabung di kelas ${r.data.data.name}!`);
        } catch (e) { error(e, models.Room.$utility) };
        this.setState({ loading: false, classCode: '' }, this.fetch.bind(this));
    }
    async fetch() {
        const { models } = this.props;
        this.setState({ ready: false });
        const rooms = await models.Room.collection();
        this.setState({ ready: true, rooms: rooms.rows });
    }
    render() {
        const { navigation } = this.props;
        const { classCode, rooms, ready, loading } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>Kelas Anda</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ flex: 9, }}>
                            <Input value={classCode} onChangeText={(t) => this.setState({ classCode: t })} errorStyle={{ display: 'none' }} containerStyle={{ margin: 0, padding: 0 }} placeholder="Isi kode kelas untuk bergabung" />
                        </View>
                        <View style={{ flex: 1, paddingTop: 10, alignItems: 'flex-end' }}>
                            <Icon name="add" disabled={loading || !classCode} onPress={this.onAdd.bind(this)} size={15} raised />
                        </View>
                    </View>
                    <View>
                        {ready ? (
                            rooms.length ? (
                                rooms.map((r, i) => (
                                    <ListItem Component={TouchableNativeFeedback} onPress={() => navigation.navigate('Room', { room: r, refreshHome: this.fetch.bind(this) })} key={i} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontWeight: 'bold' }}>{r.name}</ListItem.Title>
                                            <ListItem.Subtitle>Oleh {r.owner.name}</ListItem.Subtitle>
                                            <ListItem.Subtitle>{r.tasks.length} tugas</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                ))
                            ) : (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 15 }}>Kelas kosong</Text>
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