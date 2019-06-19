import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';


const Loading = ({
  loading, text
}) => {
  
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={loading}
        style={[styles.centering]}
        size="large"
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Loading;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: px2dp(100),
    marginBottom: px2dp(20),
  },
  text: {
    fontSize: FONT_SIZE(10),
    color: '#999'
  }
})
