
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NetInfo,
  BackHandler,
  ToastAndroid,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as userInfoActionsFromOtherFile from '../../actions/userinfo'

import LoginComponent from '../../components/Login';
import  { httpFetch }  from '../../components/Fetch';
import  DeviceStorage from '../../components/DeviceStorage';
import { StackActions, NavigationActions } from 'react-navigation';

class Login extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
      super(props);
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }



  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }
  onBackButtonPressAndroid = () => {
        let {navigation} = this.props;
        if (navigation.isFocused()) {

            if (this.lastPressAndroidBack && this.lastPressAndroidBack + 2000 >= Date.now()) {
                return false
            }
            this.lastPressAndroidBack = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true

        }
        return false;
    };
  render() {

    return (
      <LoginComponent ref={(ref) =>{this.loginRef = ref}} loginHandle = {this.loginHandle.bind(this)} />
    );
  }

  loginHandle(user){
    //调用子组件中的setState
    this.loginRef.setState({
      loading: true
    })
    const options = {
      url: "base/auth/login",
      method: "POST",
      parames: user
    }
    httpFetch(options,(res)=>{

      const rememberPassword = this.loginRef.state.checked;
      DeviceStorage.save("rememberPassword", rememberPassword);
      if(rememberPassword){
        DeviceStorage.save('loginName', user.username);
        DeviceStorage.save('loginPassword', user.password);
      }else{
        DeviceStorage.delete('loginName');
        DeviceStorage.delete('loginPassword');
      }

      this.getUserInfo();
    },(error)=>{
      this.loginRef.setState({
        loading: false
      })
      //console.error("错误-----",error)
    })

  }

  getUserInfo () {
    const options = {
      url: "base/auth/userinfo",
      method: "GET",
    }
    httpFetch(options,(res)=>{
      //console.log("数据----：",res);
      //将用户名存入redux
     const actions = this.props.userInfoActions;

     //let userInfo = this.props.userInfo;
      const user = res.data.userInfo;
      //userInfo.username = user.userName;
      actions.update(user);

      const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Lims'})],
        });
      this.props.navigation.dispatch(resetAction);
      this.loginRef.setState({
        loading: false
      })
    },(error)=>{
      this.loginRef.setState({
        loading: false
      })
      console.error("错误信息==",error)
    })
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop:px2dp(80),
  },
});

  function mapStateToProps(state) {
      return {
          userInfo: state.userInfo
      }
  }

  function mapDispatchToProps(dispatch) {
      return {
          userInfoActions: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
      }
  }
  export default connect(
      mapStateToProps,
      mapDispatchToProps
  )(Login)
