import React from 'react';
import { View, ScrollView, Text, StyleSheet, ToastAndroid, PermissionsAndroid } from 'react-native';
import { Button, ListItem, Icon } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
import RNFS from 'react-native-fs';
import _ from 'lodash';
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

class Task extends React.Component {
    state = {
        ready: false,
        participants: []
    };
    async chooseFile(task) {
        const { models, route, navigation } = this.props;
        const { room, fetch } = route.params;
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
            fetch();
            navigation.goBack();
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
    render() {
        const { route } = this.props;
        const { params: { hasPass, task } } = route;
        const warningColor = route.params.hasPass ? '#e74c3c' : '#f39c12';
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>{route.params.task.name}</Text>
                        <Border />
                        <Text style={{ fontSize: 20, marginTop: 10 }}>{route.params.task.description}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', margin: 20 }}>
                        {(!hasPass) && <Button onPress={() => this.chooseFile(task)} containerStyle={{ marginTop: 5, flex: 1 }} title="Upload Tugas" icon={{ name: 'file-upload', color: '#fff' }} />}
                        {task.hasFile && <Button onPress={() => this.download(task.id, task.filename)} containerStyle={{ marginTop: 5, flex: 1 }} title="Download Tugas" icon={{ name: 'file-download', color: '#fff' }} />}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default Task;