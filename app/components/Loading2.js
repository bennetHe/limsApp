import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated, // 这两个都是要引入的
    Easing,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListRow,Label,Toast,ActivityIndicator} from 'teaset';


export default class Loading extends Component {
    state = {
        rotateVal: new Animated.Value(0),
    }

    componentDidMount(){ // 组件加载完成后启动动画
        const animationLoading = Animated.timing(
            this.state.rotateVal, // 初始值
            {
                toValue: 360, // 终点值
                easing: Easing.linear, // 这里使用匀速曲线，详见RN-api-Easing
            }
        );
        Animated.loop(animationLoading).start(); // 开始动画
        //setTimeout(Animated.loop(animationLoading).stop, 5000); // 5秒后停止动画，可用于任意时刻停止动画

    }

    render(){ // 渲染界面
        return(
            <View style={styles.container}>
                // 我项目中用字体图标，所以这里用.Text，也可以用.Image加载一张图片，然后样式属性中transform
                <Animated.View
                    style={{
                        transform: [{ // 动画属性
                            rotate: this.state.rotateVal.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg'],
                            })
                        }]
                    }}>
                    <Icon style={styles.icon} name="spinner" />

                </Animated.View>
                <Label text='加载中' type='detail' />
            </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: FONT_SIZE(30),
    color: '#777'
  }
})
