import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableNativeFeedback, PermissionsAndroid, ToastAndroid } from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import moment from 'moment';
import { shortText } from 'limit-text-js';
import Loading from '../../Loading';
import Border from '../../../components/Border';
import error from '../../../error';
import config from '../../../../config';

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
    async chooseFile(task) {
        const { models, route } = this.props;
        const { room } = route.params;
        this.setState({ ready: false });
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.plainText]
            });
            const file = await RNFS.readFile(res.uri, 'base64');
            await models.Document.create({
                name: res.name,
                participant_id: room.participants[0].id,
                task_id: task.id,
                file: file
            });
            this.fetch();
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) error(err);
            this.setState({ ready: true });
        }
    }
    async download(id, name) {
        const url = `${config.baseURL}:${config.port}/task_document/${id}`;
        const toFile = `${RNFS.DownloadDirectoryPath}/${name}`;
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                try {
                    const res = await RNFS.downloadFile({
                        fromUrl: url,
                        toFile: toFile
                    });
                    ToastAndroid.show(`File ${name} berhasil disimpan`, ToastAndroid.LONG);
                    await FileViewer.open(toFile);
                } catch (e) { ToastAndroid.show('Error: ' + e.message, ToastAndroid.LONG) };
            } else {
                return false;
            }
        } catch (err) { console.log(err); return false }
    }
    hasPass(due) {
        const diff = moment().diff(moment(due));
        return diff >= 0;
    }
    render() {
        const { navigation, route } = this.props;
        const { tasks, ready } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>{route.params.room.name}</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1, marginTop: 10 }}>
                        {ready ? (
                            tasks.length ? (
                                tasks.map((r, i) => {
                                    const hasPass = this.hasPass(r.due_date);
                                    return (
                                        <ListItem Component={TouchableNativeFeedback} onPress={() => navigation.navigate('Task', { task: r, room: route.params.room, fetch: this.fetch.bind(this), hasPass })} key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={{
                                                    fontSize: 20,
                                                    fontWeight: 'bold',
                                                    color: r.documents.length > 0 ? '#1abc9c' : (hasPass ? '#e74c3c' : 'black')
                                                }}>
                                                    {r.name}{' '}
                                                    {r.documents.length > 0 ? <Icon name="check-circle" size={15} color="#1abc9c" /> : (
                                                        hasPass ? <Icon name="cancel" size={15} color="#e74c3c" /> : null
                                                    )}
                                                </ListItem.Title>
                                                <ListItem.Subtitle style={{ fontSize: 18 }}>{shortText(r.description, 50, '...')}</ListItem.Subtitle>
                                                <ListItem.Subtitle style={{ fontSize: 18 }}>Berakhir {moment(r.due_date).fromNow()}</ListItem.Subtitle>
                                                {/* {(!hasPass && r.documents.length === 0) && <Button onPress={() => this.chooseFile(r)} containerStyle={{ marginTop: 5 }} title="Upload Tugas" icon={{ name: 'file-upload', color: '#fff' }} />}
                                                {r.hasFile && <Button onPress={() => this.download(r.id, r.filename)} containerStyle={{ marginTop: 5 }} title="Download Tugas" icon={{ name: 'file-download', color: '#fff' }} />} */}
                                            </ListItem.Content>
                                        </ListItem>
                                    )
                                })
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