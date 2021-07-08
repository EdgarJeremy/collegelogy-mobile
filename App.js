/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import SiriusAdapter from '@edgarjeremy/sirius.adapter';

import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Loading from './src/screens/Loading';
import Error from './src/screens/Error';

import { LHome, LRoom, SHome, SRoom } from './src/screens/panel';

const Stack = createStackNavigator();
const adapter = new SiriusAdapter('http://10.0.2.2', 1234, AsyncStorage);

class App extends React.Component {
  state = { user: null, ready: false, error: false, models: null, authProvider: null }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    try {
      this.setState({ ready: false });
      const models = await adapter.connect();
      const authProvider = adapter.getAuthProvider();
      try {
        const user = await authProvider.get();
        this.setState({ ready: true, error: false, user, models, authProvider });
      } catch (e) { this.setState({ ready: true, error: false, models, authProvider }); }
    } catch (e) {
      this.setState({ ready: true, error: true });
    }
  }

  setUser(user) {
    this.setState({ user });
  }

  async onLogout() {
    const { authProvider } = this.state;
    try {
      await authProvider.remove();
    } catch (e) { }
    this.setUser(null);
  }

  render() {
    const { ready, user, error, models, authProvider } = this.state;
    return (
      <SafeAreaProvider>
        {ready ? (
          !error ? (
            <NavigationContainer>
              {!user ? (
                <Stack.Navigator>
                  <Stack.Screen options={{ headerShown: false }} name="Login">
                    {props => <Login {...props} user={user} models={models} authProvider={authProvider} setUser={this.setUser.bind(this)} />}
                  </Stack.Screen>
                  <Stack.Screen options={{ headerShown: false }} name="Register">
                    {props => <Register {...props} user={user} models={models} authProvider={authProvider} />}
                  </Stack.Screen>
                </Stack.Navigator>
              ) : (
                user.type === 'lecturer' ? (
                  <Stack.Navigator screenOptions={{ title: 'CollegeLogy' }}>
                    <Stack.Screen options={{
                      headerRight: () => <Icon onPress={this.onLogout.bind(this)} name="logout" />,
                      headerRightContainerStyle: { paddingRight: 12 }
                    }} name="Home">
                      {props => <LHome {...props} user={user} models={models} authProvider={authProvider} />}
                    </Stack.Screen>
                    <Stack.Screen options={{ title: 'Kelas' }} name="Room">
                      {props => <LRoom {...props} user={user} models={models} authProvider={authProvider} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                ) : (
                  <Stack.Navigator screenOptions={{ title: 'CollegeLogy' }}>
                    <Stack.Screen options={{
                      headerRight: () => <Icon onPress={this.onLogout.bind(this)} name="logout" />,
                      headerRightContainerStyle: { paddingRight: 12 }
                    }} name="Home">
                      {props => <SHome {...props} user={user} models={models} authProvider={authProvider} />}
                    </Stack.Screen>
                    <Stack.Screen options={{ title: 'Kelas' }} name="Room">
                      {props => <SRoom {...props} user={user} models={models} authProvider={authProvider} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                )
              )}
            </NavigationContainer>
          ) : (<Error retry={this.fetch.bind(this)} />)
        ) : (<Loading />)
        }
      </SafeAreaProvider>
    )
  }
}

export default App;
