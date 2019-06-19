'use strict';

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  NetInfo
} from 'react-native';
import { Provider } from 'react-redux';
import './util/Global';
import Navigation from './Navigation';
import NavigationService from './NavigationService';
import configureStore from './store/configureStore'


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const store = configureStore()
export default class App extends Component<{}> {
constructor(props) {
    super(props);
    this.timer = null;
  }


  componentWillMount() {

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

    componentWillUnMount() {
        NetInfo.removeEventListener('change', this.handleFirstConnectivityChange);
        this.timer && clearTimeout(this.timer);
    }


    handleFirstConnectivityChange=(isConnected)=> {
        if(!isConnected){
          this.timer = setInterval(()=>{
            Toast.message('网络异常');
          },5000);

        }else{
          this.timer && clearTimeout(this.timer);
        }

    }

  render() {
    return (
      <Provider store={store}>
        <Navigation ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
      </Provider>
    );
  }
}
