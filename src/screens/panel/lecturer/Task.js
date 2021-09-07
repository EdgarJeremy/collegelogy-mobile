import React from 'react';
import { View, ScrollView, Text, StyleSheet, ToastAndroid, PermissionsAndroid } from 'react-native';
import { Button, ListItem, Icon, Input, Divider } from 'react-native-elements';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import Loading from '../../Loading';
import Border from '../../../components/Border';
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
        participants: [],
        edit: false,
        name: null,
        editName: null
    };
    componentDidMount() {
        const { route } = this.props;
        this.setState({ name: route.params.task.name, editName: route.params.task.name });
        this.fetch();
    }
    async fetch() {
        const { models, route } = this.props;
        this.setState({ ready: false });
        const participants = await models.Participant.collection({
            attributes: ['id'],
            distinct: true,
            where: {
                room_id: route.params.room.id,
            },
            include: [{
                attributes: ['id', 'name', 'username'],
                model: 'User',
                as: 'student'
            }, {
                attributes: ['id', 'name'],
                model: 'Document',
                where: {
                    task_id: route.params.task.id
                },
                required: false,
                include: [{
                    attributes: ['id', 'percentage', 'a_id', 'b_id'],
                    model: 'Difference',
                    where: {
                        task_id: route.params.task.id
                    },
                    include: [{
                        attributes: ['id', 'content'],
                        model: 'Document',
                        as: 'a'
                    }, {
                        attributes: ['id', 'content'],
                        model: 'Document',
                        as: 'b',
                        include: [{
                            attributes: ['id'],
                            model: 'Participant',
                            include: [{
                                attributes: ['name'],
                                model: 'User',
                                as: 'student'
                            }]
                        }]
                    }],
                    required: false
                }]
            }]
        });
        this.setState({ ready: true, participants: participants.rows });
    }
    async download(id, name) {
        const url = `${config.baseURL}:${config.port}/document/${id}`;
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
        } catch (err) { return false }
    }
    getMax(differences) {
        return _.maxBy(differences, 'percentage').percentage;
    }
    async onEdit() {
        const { editName } = this.state;
        const { route } = this.props;
        const { params: { task, fetch } } = route;
        await task.update({ name: editName });
        this.setState({ name: editName, edit: false }, () => fetch());
    }
    render() {
        const { navigation, route } = this.props;
        const { ready, participants, edit, name, editName } = this.state;
        const { params: { hasPass } } = route;
        const warningColor = route.params.hasPass ? '#e74c3c' : '#f39c12';
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingTop: 20 }}>
                        {!edit ? (
                            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={style.title}>{name} <Icon onPress={() => this.setState({ edit: true })} color="#3498db" name="edit" size={25} /></Text>
                                <Border />
                            </View>
                        ) : (
                            <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                                <View style={{ flex: 5, }}>
                                    <Input value={editName} onChangeText={(t) => this.setState({ editName: t })} errorStyle={{ display: 'none' }} containerStyle={{ margin: 0, padding: 0 }} inputStyle={{ fontSize: 25, fontWeight: 'bold' }} placeholder="Edit tugas" />
                                </View>
                                <View style={{ flex: 1, paddingTop: 10, alignItems: 'flex-end' }}>
                                    <Icon name="save" onPress={this.onEdit.bind(this)} size={20} raised />
                                </View>
                                <View style={{ flex: 1, paddingTop: 10, alignItems: 'flex-end' }}>
                                    <Icon name="cancel" onPress={() => this.setState({ edit: false, editName: name })} size={20} raised />
                                </View>
                            </View>
                        )}
                        <Text style={{ fontSize: 20, paddingLeft: 20, paddingRight: 20, marginTop: 10 }}>{route.params.task.description}</Text>
                    </View>
                    <Divider style={{ marginTop: 20 }} />
                    <View style={{ flex: 1 }}>
                        {ready ? (
                            participants.length ? (
                                participants.map((r, i) => {
                                    const score = r.documents[0] ? (r.documents[0].differences.length > 0 ? this.getMax(r.documents[0].differences) : null) : null;
                                    return (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 4 }}>
                                                        <ListItem.Title style={{
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            color: (r.documents.length === 0 ? warningColor : 'black')
                                                        }}>{r.student.name.toUpperCase()}</ListItem.Title>
                                                        <ListItem.Subtitle style={{ fontSize: 20 }}>{r.student.username}</ListItem.Subtitle>
                                                        {r.documents.length > 0 ? (
                                                            hasPass && r.documents[0].differences.length > 0 && <ListItem.Subtitle>Skor plagiat tertinggi: {score}%</ListItem.Subtitle>
                                                        ) : (
                                                            <ListItem.Subtitle style={{ fontSize: 18 }}>Peserta {hasPass ? 'tidak' : 'belum'} mengupload dokumen</ListItem.Subtitle>
                                                        )}
                                                    </View>
                                                    {r.documents.length > 0 ? (
                                                        (hasPass && r.documents[0].differences.length > 0) && <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                            <Progress.Circle animated={false} showsText color={(() => {
                                                                const percent = score;
                                                                let color = "#2ecc71"; // green
                                                                if (percent > 20 && percent < 50) {
                                                                    color = "#f39c12"; // orange
                                                                } else if (percent > 50) {
                                                                    color = "#e74c3c";
                                                                }
                                                                return color;
                                                            })()} size={60} progress={(score) / 100} />
                                                        </View>
                                                    ) : (
                                                        hasPass && <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                            <Icon name="close" color="#e74c3c" size={60} />
                                                        </View>
                                                    )}
                                                </View>
                                                {r.documents.length > 0 && (
                                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                                                        <Button raised onPress={async () => {
                                                            const name = r.student.name + '_' + r.documents[0].name;
                                                            await this.download(r.documents[0].id, name);
                                                        }} icon={{ name: 'file-download' }} containerStyle={{ flex: 1 }} titleStyle={{ color: '#000' }} type="outline" title={r.documents[0].name.length > 10 ? r.documents[0].name.substring(0, 10) + '...' : r.documents[0].name} />
                                                        {(hasPass && r.documents[0].differences.length > 0) && <Button raised onPress={() => navigation.navigate('Difference', { student: r.student, others: r.documents[0].differences })} icon={{ name: 'compare' }} containerStyle={{ flex: 1 }} titleStyle={{ color: '#000' }} type="outline" title="Cek Plagiat" />}
                                                    </View>
                                                )}
                                            </ListItem.Content>
                                        </ListItem>
                                    )
                                })
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 15, marginBottom: 15 }}>Tidak ada peserta kelas</Text>
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

export default Task;