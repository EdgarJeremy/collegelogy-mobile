import React from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, Input, Button, Text } from 'react-native-elements';

const style = StyleSheet.create({
    smText: { fontSize: 20 },
    link: { color: '#3498db', textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 20 },
    center: { textAlign: 'center' }
});

class Login extends React.Component {
    state = {
        loading: false,
        data: {
            username: '',
            password: '',
        }
    }
    onChange(f, v) {
        const { data } = this.state;
        data[f] = v;
        this.setState({ data });
    }
    onSubmit() {
        const { data, type } = this.state;
        const { authProvider, navigation, setUser } = this.props;
        if (data.password && data.username) {
            this.setState({ loading: true }, async () => {
                try {
                    const user = await authProvider.set(data);
                    this.setState({
                        loading: false, data: {
                            username: '',
                            name: '',
                            password: '',
                        }
                    }, () => {
                        console.log(user);
                        setUser(user);
                    });
                } catch (e) {
                    console.log(e.response);
                    if (!e.response) {
                        alert('Server tidak dapat dihubungi');
                    } else {
                        alert('Username/password salah');
                    }
                    this.setState({ loading: false });
                }
            });
        } else {
            alert('Isi semua field!');
        };
    }
    render() {
        const { data } = this.state;
        const { navigation } = this.props;
        return (
            <View>
                <ScrollView>
                    <Image source={require('../images/logo.png')} style={{ width: Dimensions.get('screen').width / 1.5, resizeMode: 'contain', alignSelf: 'center', height: 200, marginTop: 10 }} />
                    <Card>
                        <Card.Title h4>Login | Collegelogy</Card.Title>
                        <Card.Divider />
                        <View>
                            <Input value={data.username} onChangeText={(t) => this.onChange('username', t)} inputStyle={style.smText} label="Email" placeholder="Email" leftIcon={{ name: 'person' }} />
                            <Input value={data.password} onChangeText={(t) => this.onChange('password', t)} secureTextEntry={true} inputStyle={style.smText} label="Password" placeholder="Password" leftIcon={{ name: 'lock' }} />
                            <Button raised onPress={this.onSubmit.bind(this)} titleStyle={{ fontSize: 20 }} title="Login" type="outline" />
                        </View>
                        <Card.Divider />
                        <Text style={[style.link, style.center]} onPress={() => navigation.navigate('Register')}>Belum punya akun?</Text>
                    </Card>
                </ScrollView>
            </View>
        )
    }
}

export default Login;