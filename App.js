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
import SiriusAdapter from '@edgarjeremy/sirius.adapter';

import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Loading from './src/screens/Loading';
import Error from './src/screens/Error';

import Home from './src/screens/panel/Home';

const Stack = createStackNavigator();
const adapter = new SiriusAdapter('http://10.0.2.2', 1234, AsyncStorage);

class App extends React.Component {
  state = { user: null, ready: false, error: false, models: null }

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
                <Stack.Navigator>
                  <Stack.Screen options={{ headerShown: false }} name="Home">
                    {props => <Home {...props} user={user} models={models} authProvider={authProvider} />}
                  </Stack.Screen>
                </Stack.Navigator>
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
