import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableNativeFeedback, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import moment from 'moment';
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
        tasks: [],
    };
    componentDidMount() {
        this.fetch();
    }
    async fetch() {
        const { models, route } = this.props;
        this.setState({ ready: false });
        const tasks = await models.Task.collection({ where: { room_id: route.params.room.id } });
        this.setState({ ready: true, tasks: tasks.rows });
    }
    async chooseFile(task_id) {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.docx]
            });
            const file = await RNFS.readFile(res.uri, 'base64');
            console.log(res, file);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) Alert.alert('Error', err.message);
        }
    }
    render() {
        const { route } = this.props;
        const { tasks, ready } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>{route.params.room.name}</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1 }}>
                        {ready ? (
                            tasks.length ? (
                                tasks.map((r, i) => (
                                    <ListItem onPress={() => this.chooseFile(r.id)} Component={TouchableNativeFeedback} key={i} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontWeight: 'bold' }}>{r.name}</ListItem.Title>
                                            <ListItem.Title>{r.description}</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                ))
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 15 }}>Belum ada tugas</Text>
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