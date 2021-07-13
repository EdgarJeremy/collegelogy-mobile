import React from 'react';
import { View, ScrollView, Text, StyleSheet, ToastAndroid, TouchableNativeFeedback } from 'react-native';
import { Button, Input, ListItem, Icon } from 'react-native-elements';
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

class Task extends React.Component {
    state = {
        ready: false,
        participants: []
    };
    componentDidMount() {
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
                        attributes: ['id'],
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
                    }]
                }]
            }]
        });
        console.log(participants);
        this.setState({ ready: true, participants: participants.rows });
    }
    render() {
        const { navigation, route } = this.props;
        const { tasks, ready, participants } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>{route.params.room.name}</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* {ready ? (
                            participants.length ? (
                                participants.map((r, i) => {
                                    return (
                                        <ListItem Component={TouchableNativeFeedback} key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={{
                                                    fontWeight: 'bold',
                                                    color: (hasPass ? '#f39c12' : 'black')
                                                }}>{r.name} {hasPass ? <Icon name="lock" color="#f39c12" size={15} /> : null}</ListItem.Title>
                                                <ListItem.Subtitle>{r.description}</ListItem.Subtitle>
                                                <ListItem.Subtitle>Berakhir {moment(r.due_date).fromNow()}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>
                                    )
                                })
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 15 }}>Tugas kosong. Tambah tugas baru</Text>
                                </View>
                            )
                        ) : (
                            <Loading />
                        )} */}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default Task;