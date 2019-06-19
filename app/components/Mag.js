/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button,Label} from 'teaset';
import { StackActions, NavigationActions } from 'react-navigation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class Mag extends Component<{}> {

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  render() {

    const { params } = this.props.navigation.state;
    //console.log("----------",params);
    return (
      <View style={styles.container}>
        <View style={styles.IconView}>
          {params.mag.icon}

        </View>
        <View style={styles.msgTextArea}>
          <Text style={styles.msgTextTitle}>
            {params.mag.title}
          </Text>
          <Text style={styles.msgTetxDesc}>
            {params.mag.magText}
          </Text>
        </View>
        <View style={styles.buttonView}>
        <Button
          onPress = {()=>{this.goBackLims()}}
          style={{backgroundColor: '#04BE02', borderColor: '#FFF',width: SCREEN_WIDTH*0.8}}
        >
          <Text style={{color: '#FFF', fontSize: FONT_SIZE(16)}} >
            首页
          </Text>
        </Button>

        </View>
      </View>
    );
  }

  goBackLims(){
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Lims' })],
      });
    this.props.navigation.dispatch(resetAction);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  IconView: {

    alignItems: 'center',
    marginTop: px2dp(80),
    marginBottom: px2dp(50),
  },
  msgTextArea: {
    marginBottom: px2dp(25),
  },
  msgTextTitle: {
    marginBottom: px2dp(15),
    textAlign: 'center',
    fontSize: FONT_SIZE(18),
  },
  msgTetxDesc: {
    textAlign: 'center',
    color: '#999',
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: px2dp(15),
  },
});
