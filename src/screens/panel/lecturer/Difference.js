import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Button, ListItem, Icon } from 'react-native-elements';
import * as Progress from 'react-native-progress';
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

class Difference extends React.Component {
    state = {
        ready: false,
        others: []
    };
    componentDidMount() {
        const { route } = this.props;
        this.setState({ others: route.params.others });
    }
    render() {
        const { route } = this.props;
        const { others } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.container}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        <Text style={style.title}>Presentase Plagiat {route.params.student.name}</Text>
                        <Border />
                    </View>
                    <View style={{ flex: 1 }}>
                        {
                            others.length ? (
                                others.map((r, i) => {
                                    return (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={{ fontWeight: 'bold' }}>{r.b.participant.student.name.toUpperCase()}</ListItem.Title>
                                                <ListItem.Subtitle>Presentase plagiat: {r.percentage}%</ListItem.Subtitle>
                                                <Progress.Bar style={{ marginTop: 10, flex: 1 }} progress={r.percentage / 100} color={(() => {
                                                    const percent = r.percentage;
                                                    let color = "#2ecc71"; // green
                                                    if (percent > 20 && percent < 50) {
                                                        color = "#f39c12"; // orange
                                                    } else if (percent > 50) {
                                                        color = "#e74c3c";
                                                    }
                                                    return color;
                                                })()} />
                                            </ListItem.Content>
                                        </ListItem>
                                    )
                                })
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 15 }}>Tidak ada peserta untuk dibandingkan</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default Difference;