import React from 'react';
import { View, ScrollView, Text, StyleSheet, ToastAndroid } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from '../../Loading';
import Border from '../../../components/Border';

import 'moment/locale/id';

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

class Room extends React.Component {
    state = {
        ready: false,
        newTask: {
            name: '',
            description: '',
            due_date: null
        },
        tasks: [],
        openForm: false,
        openDate: false,
        openTime: false,

        deleteLoading: false,
        addLoading: false
    };
    componentDidMount() {
        this.fetch();
    }
    async onAdd() {
        const { models, route } = this.props;
        const { newTask } = this.state;
        newTask.room_id = route.params.room.id;
        this.setState({ addLoading: true });
        const task = await models.Task.create(newTask);
        this.setState({
            addLoading: false, newClass: {
                name: '',
                description: '',
                due_date: null
            },
            openForm: false
        }, this.fetch.bind(this));
    }
    async fetch() {
        const { models, route } = this.props;
        this.setState({ ready: false });
        const tasks = await models.Task.collection({ where: { room_id: route.params.room.id } });
        this.setState({ ready: true, tasks: tasks.rows });
    }
    async onDelete() {
        const { navigation, route } = this.props;
        const room = route.params.room;
        this.setState({ deleteLoading: true });
        await room.delete();
        navigation.navigate('Home');
        route.params.refreshHome();
    }
    onCopyCode() {
        const { route } = this.props;
        const room = route.params.room;
        Clipboard.setString(room.code);
        ToastAndroid.show(`Kode kelas tersalin ke clipboard! (${room.code})`, 1000);
    }
    render() {
        const { navigation, route } = this.props;
        const { newTask, tasks, ready, openForm, openDate, openTime, addLoading, deleteLoading } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>{route.params.room.name}</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1, marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
                            <Button type="outline" containerStyle={{ flex: 1 }} icon={{ name: 'add' }} raised onPress={() => this.setState({ openForm: !openForm })} />
                            <Button type="outline" containerStyle={{ flex: 1 }} icon={{ name: 'content-copy' }} raised onPress={this.onCopyCode.bind(this)} />
                            <Button type="outline" containerStyle={{ flex: 1 }} icon={{ name: 'delete', color: '#e74c3c' }} loading={deleteLoading} raised onPress={this.onDelete.bind(this)} />
                        </View>
                        {openForm && <View>
                            <Input value={newTask.name} onChangeText={(t) => this.setState({ newTask: { ...newTask, name: t } })} containerStyle={{ margin: 0, padding: 0 }} errorStyle={{ display: 'none' }} placeholder="Judul" />
                            <Input value={newTask.description} onChangeText={(t) => this.setState({ newTask: { ...newTask, description: t } })} errorStyle={{ display: 'none' }} containerStyle={{ margin: 0, padding: 0 }} placeholder="Deskripsi" />
                            <Input value={newTask.due_date ? moment(newTask.due_date).format('dddd Do MMMM YYYY, h:mm:ss a') : undefined} onPressOut={() => this.setState({ openDate: true, newTask: { ...newTask, due_date: newTask.due_date ? newTask.due_date : new Date() } })} containerStyle={{ margin: 0, padding: 0 }} placeholder="Tenggat Waktu" />
                            <Button title="Tambah" disabled={!newTask.name || !newTask.description || !newTask.due_date} loading={addLoading} onPress={this.onAdd.bind(this)} />
                            {openDate && <DateTimePicker
                                value={newTask.due_date}
                                mode="date"
                                is24Hour={true}
                                display="default"
                                onChange={(e, v) => !!v && this.setState({ newTask: { ...newTask, due_date: v }, openDate: false, openTime: true })}
                            />}
                            {openTime && <DateTimePicker
                                value={newTask.due_date}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(e, v) => !!v && this.setState({ newTask: { ...newTask, due_date: v }, openTime: false })}
                            />}
                        </View>}
                    </View>
                    <View style={{ flex: 1 }}>
                        {ready ? (
                            tasks.length ? (
                                tasks.map((r, i) => (
                                    <ListItem key={i} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontWeight: 'bold' }}>{r.name}</ListItem.Title>
                                            <ListItem.Title>{r.description}</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                ))
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 15 }}>Tugas kosong. Tambah tugas baru</Text>
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

export default Room;