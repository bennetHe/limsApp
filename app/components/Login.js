import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, BackHandler, StyleSheet, ScrollView,AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button,Label,Checkbox} from 'teaset';
import Input  from './Input'
import ItemCard from './ItemCard'
import  DeviceStorage from './DeviceStorage';
class LoginComponent extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            username: '',
            password: '',
            loading: false,
            checked: false
        }

    }

    componentDidMount(){
    //   AsyncStorage.clear(function (error) {
    //     if (error) {
    //         alert('文件删除失败')
    //     }else {
    //         alert('文件删除完成')
    //     }
    // })
      this.getStorageUserInfo();

    }

    getStorageUserInfo = () => {
      DeviceStorage.get('loginName').then((tags) => {
              this.setState({
                  username: tags
              })
          });
      DeviceStorage.get('loginPassword').then((tags) => {
              this.setState({
                  password: tags
              })
          });
      DeviceStorage.get('rememberPassword').then((tags) => {
              this.setState({
                  checked: tags
              })
          });
    }

    render(){

        const {username ,password, loading} = this.state;
        let but = true;
        if(username && password){
          but = false;
        }

        return (
          <View style={styles.loginview}>
            <View>
              <Text style={[ styles.textStyle, { color: "#fff" } ] }>
    						Lims 登录
    					</Text>

              <ItemCard style={ styles.inputCardStyle } itemCardBackgroundColor= "#fff">
                <Input
                  label = { <Icon name={'user'} size={25} color={'grey'}/> }
                  placeholder="用户名"
                  value={ username }
                  onChangeText = { this.userHandle.bind(this) }
                  editable= { true }
                  autoCapitalize = "none"
                  maxLength = { 10 }
                />
    					</ItemCard>
              <ItemCard style={ styles.inputCardStyle } itemCardBackgroundColor= "#fff">
    						 <Input
      							label = { <Icon name={'lock'} size={25} color={'grey'}/> }
      							placeholder="******"
      							secureTextEntry = {true}
      							value={ password }
                    onChangeText={ this.passwordHandle.bind(this) }
      							editable= { true }
      							autoCapitalize = "none"
      							maxLength = { 15 }
    						/>
  					  </ItemCard>
              <View style={ styles.checkPass }>
                <Checkbox
                 title='记住密码'
                 titleStyle={{color: '#fff', paddingLeft:10 }}
                 checkedIconStyle={{backgroundColor: '#fff'}}
                 checked={this.state.checked}
                 onChange={checked => this.setState({checked})}
                 />
  					  </View>
              <Button type='primary'
                size='lg'
                title= {
                    loading
                    ? <View style={{flex: 1, flexDirection: 'row', justifyContent:'center',}}>
                        <Label style={{color: '#fbfbfd', marginTop: px2dp(10)}} size='lg' text="登录中" />
                        <ActivityIndicator size='small' color='#fbfbfd' style={{marginTop: 7,marginLeft: 4}} />
                      </View>
                    : <Label style={{color: '#fbfbfd', marginTop: px2dp(10)}} size='lg' text="登录" />
                  }
                onPress={ this.loginHandle.bind(this) }
                style={styles.loginBottonStyle}
                disabled = {but ? true : loading}
              />

            </View>

          </View>
        )
    }

    userHandle(value){
        this.setState({
            username: value
        })
    }
    passwordHandle(value){
      this.setState({
          password: value
      })
    }

    loginHandle (){
        //this.setState({loading: true});
        const user = {
          username: this.state.username,
          password: this.state.password
        }
        const loginHandle = this.props.loginHandle;
        loginHandle(user);
    }
}

const styles = StyleSheet.create({
  loginview: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundImage: 'linear-gradient(305deg, #ABDCFF 0%, #0396FF 100%)'
    backgroundColor:'#0396FF'
  },
	loginBottonStyle:{
		marginTop: 7,
	},
	textStyle:{
		fontSize: 40,
		alignSelf: 'flex-start',
		marginLeft: 10,
		marginBottom: 10,
	},
	inputCardStyle: {
    width: SCREEN_WIDTH*0.9,
		paddingLeft: 2,
		paddingRight: 2,
		padding: 2,
		marginTop: 4,
    borderRadius:5
	},
  checkPass: {
    padding: 9,
		paddingLeft: 14,
		paddingRight: 14,
		//justifyContent: 'center',
		flexDirection: 'row',
		//alignSelf: 'center',
		margin: 4,
		marginTop: 2,
		borderRadius: 2
  }
});

export default LoginComponent
