import React from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, Input, Button, Text, ButtonGroup, Icon } from 'react-native-elements';

const style = StyleSheet.create({
    smText: { fontSize: 20 },
    link: { color: '#3498db', textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 20 },
    center: { textAlign: 'center' },
    boxContainer: { flex: 1, flexWrap: 'wrap', flexDirection: 'row' },
    box: { flex: 1, borderWidth: 1, borderColor: '#aaa' }
});

class Register extends React.Component {
    state = {
        loading: false,
        type: 0, data: {
            username: '',
            name: '',
            password: '',
        }
    }
    updateType(i) {
        this.setState({ type: i });
    }
    onChange(f, v) {
        const { data } = this.state;
        data[f] = v;
        this.setState({ data });
    }
    onSubmit() {
        const { data, type } = this.state;
        const { models, navigation } = this.props;
        if (data.name && data.password && data.username) {
            this.setState({ loading: true }, async () => {
                try {
                    data.type = type === 0 ? 'lecturer' : 'student';
                    await models.User.create(data);
                    this.setState({
                        loading: false, data: {
                            username: '',
                            name: '',
                            password: '',
                        }
                    }, () => {
                        alert('Pendaftaran berhasil');
                        navigation.goBack();
                    });
                } catch (e) {
                    alert('Server tidak dapat dihubungi');
                    this.setState({ loading: false });
                }
            });
        } else {
            alert('Isi semua field!');
        };
    }
    render() {
        const { type, loading, data } = this.state;
        const { navigation } = this.props;
        return (
            <View>
                <ScrollView>
                    <Image source={require('../images/logo.png')} style={{ width: Dimensions.get('screen').width / 1.5, resizeMode: 'contain', alignSelf: 'center', height: 200, marginTop: 10 }} />
                    <Card>
                        <Card.Title h4>Register | Collegelogy</Card.Title>
                        <Card.Divider />
                        <View>
                            <ButtonGroup
                                onPress={this.updateType.bind(this)}
                                selectedIndex={type}
                                selectedButtonStyle={{ backgroundColor: 'rgba(52, 152, 219,0.3)' }}
                                buttons={[{
                                    element: () => (
                                        <View>
                                            <Icon name="school" size={50} />
                                            <Text style={{fontSize: 20}}>Dosen</Text>
                                        </View>
                                    )
                                }, {
                                    element: () => (
                                        <View>
                                            <Icon name="person" size={50} />
                                            <Text style={{fontSize: 20}}>Mahasiswa</Text>
                                        </View>
                                    )
                                }]}
                                containerStyle={{ height: 100 }}
                            />
                            <Input value={data.username} onChangeText={(t) => this.onChange('username', t)} inputStyle={style.smText} label="Email" placeholder="Email" leftIcon={{ name: 'person' }} />
                            <Input value={data.name} onChangeText={(t) => this.onChange('name', t)} inputStyle={style.smText} label="Nama Lengkap" placeholder="Nama Lengkap" leftIcon={{ name: 'person' }} />
                            <Input value={data.password} secureTextEntry={true} onChangeText={(t) => this.onChange('password', t)} inputStyle={style.smText} label="Password" placeholder="Password" leftIcon={{ name: 'lock' }} />
                            <Button raised loading={loading} onPress={this.onSubmit.bind(this)} titleStyle={{fontSize: 20}} type="outline" title="Daftar" />
                        </View>
                        <Card.Divider />
                        <Text style={[style.link, style.center]} onPress={() => navigation.goBack()}>Login</Text>
                    </Card>
                </ScrollView>
            </View>
        )
    }
}

export default Register;