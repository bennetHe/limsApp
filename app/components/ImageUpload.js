/**
 * 上传照片组件
 */

import React, { Component } from 'react';
import {
  Platform,
 StyleSheet,
 Text,
 View,
 PixelRatio,
 TouchableOpacity,
 Image,
 ScrollView,
 Dimensions
} from 'react-native';
import SYImagePicker from 'react-native-syan-image-picker';
import Icon from "react-native-vector-icons/Ionicons";
import { ActionSheet } from 'teaset';
import  { httpFetch, uploadPhoto }  from './Fetch';



const {width} = Dimensions.get('window');


export default class ImageUpload extends Component {
  // static navigationOptions = {
  //   title: '图片',
  //   // header: null,
  //   // gesturesEnabled: false
  // };
  constructor(props) {
    super(props);

    this.state = {
       photos: [],
       photoList: this.props.photoList || [],
       photoNames: this.props.photoNames || []
    }
    this.fileUrl = [];
    this.fileName = [];

  }

  componentDidMount(){

    }

    /**
     * 从照片中选择
     */
    handleOpenImagePicker = () => {
         SYImagePicker.showImagePicker({imageCount: 30, isRecordSelected: true}, (err, photos) => {
             console.log(err, photos);
             if (!err) {

                 this.setState({
                     photos
                 })
                 // for (let p of photos) {
                 //   this.uploadImage(p);
                 // }
             }
         })
     };

     /**
      * 拍照
      */
     handleLaunchCamera = () => {
         SYImagePicker.openCamera({
           isCrop: false,
           showCropFrame: false
         }, (err, photos) => {
             //console.log(err, photos);
             if (!err) {
                 this.setState({
                     photos: [...this.state.photos, ...photos]
                 })
             }
         })
     };

     // 清除缓存
     handleDeleteCache = () => {
        //console.log("清除缓存");
         SYImagePicker.deleteCache();
     };

     componentWillUnmount(){
       this.handleDeleteCache();
     }

     /**
      * 删除图片
      * @param  {[type]} index [description]
      * @return {[type]}       [description]
      */
     handleRemoveAllPhoto = (index) =>{
        const { photos } = this.state;

        const newPhotos = photos.filter((photo, photoIndex) => photoIndex !== index);
        //this.onRemoveUplode(photos.filter((photo, photoIndex) => photoIndex === index)[0])
        //console.log(newPhotos);
        // 更新原生图片数组
        SYImagePicker.removePhotoAtIndex(index);
        // 更新 RN 页面
        this.setState({ photos: newPhotos });

     }

     uploadPhotos = () => {

        //const uploadState = this.img.state;
        const fileName = this.state.photoNames,
              fileUrl =  this.state.photoList;
       const uploadfile = this.state.photos;
         uploadPhoto(uploadfile,(res)=>{
           //console.log(res);
           fileUrl.push(res.msg);
           fileName.push('手机照片');

         });
         console.log(fileUrl,fileName);

     }


     deleteUplode = (file , index) => {
       const { photoList, photoNames } = this.state;
       console.log(file);
       const url = file.uri;
       const newArr = photoList.filter((photo) => photo !== url);
       const newName = photoNames.filter((photo,key) => key !== index);
       console.log(newName);
       this.onRemoveUplode(file);
       this.setState({ photoList: newArr,photoNames: newName });
     }

     /**
      * 上传删除 公共方法
      * @param  {[type]} file 删除的对象
      * @return {[type]}      返回 true
      */
     onRemoveUplode =(file)=>{
       const fileURL = file.uri,
             index = fileURL.search(/\/[^\/]*$/g),
             name = fileURL.substring(index + 1, fileURL.length);
       console.log(name);
       const options = {
         url: "limsrest/file/deleteFile",
         method: "POST",
         parames:{filename: name}
       }
       httpFetch(options,(res)=>{
         console.log(res);
         Toast.message("删除成功");

       },(error)=>{
         Toast.message(error);
       })
    }


  handleAddPhoto () {
    let items = [
      {title: '拍照', onPress: () => this.handleLaunchCamera()},
      {title: '从手机相册选择', onPress: ()=>{this.handleOpenImagePicker()}},
    ];
    let cancelItem = {title: '取消'};
    ActionSheet.show(items, cancelItem);
  }

  render() {
      const {photos, photoList,photoNames} = this.state;
      const { onRemove } = this.props;
      //console.log("photoList===",onRemove);
      return (
        <View style={{flex: 1}} style={styles.scroll}>
            {
              photoList.map((pl,key)=>{
                let source = { uri: pl };
                return (
                  <View key={`http-${key}`} style={[styles.avatar, styles.avatarContainer]}>
                    <Image
                        resizeMode='cover'
                        style={styles.avatar}
                        source={source}
                    />
                  {
                    onRemove
                    ? null
                    : <TouchableOpacity onPress={()=>this.deleteUplode(source, key)} style={styles.delete}>
                        <Icon size={15} color="#fff"  name="md-close" />
                      </TouchableOpacity>
                  }
                  </View>
                )
              })
            }
            {photos.map((photo, index) => {
                let source = { uri: photo.uri };
                // if (photo.enableBase64) {
                //     source = { uri: photo.base64 };
                // }

                return (
                  <View key={`image-${index}`} style={[styles.avatar, styles.avatarContainer]}>
                    <Image
                        resizeMode='cover'
                        style={styles.avatar}
                        source={source}
                    />
                    {
                      onRemove
                      ? null
                      : <TouchableOpacity onPress={()=>this.handleRemoveAllPhoto(index)} style={styles.delete}>
                          <Icon size={15} color="#fff"  name="md-close" />
                        </TouchableOpacity>
                    }
                  </View>
                )
            })}
            {
              onRemove
              ? null
              : <TouchableOpacity onPress={()=>this.handleAddPhoto()}  style={styles.addImage} >
                  <Icon size={FONT_SIZE(40)} color="#d9d9d9"  name="md-image" />
                  <Text style={{fontSize: FONT_SIZE(10),color: '#999'}}>添加图片</Text>
                </TouchableOpacity>
            }

        </View>
      )

  }

}

const styles = StyleSheet.create({
   scroll: {
       flex: 1,
       padding: px2dp(10),
       flexDirection: 'row',
       flexWrap:'wrap',
   },
   avatarContainer: {
      width: (SCREEN_WIDTH-40)/4,
      height: (SCREEN_WIDTH-40)/4,
      alignItems: 'center',
      justifyContent: 'center',
      margin: px2dp(7),
   },
   avatar: {
       width: (SCREEN_WIDTH-40)/4,
       height: (SCREEN_WIDTH-40)/4,

   },
   addImage: {
     flexDirection: 'column',
     justifyContent: 'center',
     alignItems: 'center',
     //backgroundColor: 'powderblue',
     width: (SCREEN_WIDTH-40)/4,
     height: (SCREEN_WIDTH-40)/4,
     borderColor: '#d9d9d9',
     borderWidth: 1,
     borderStyle: 'dashed',
     margin: px2dp(7),
   },
    delete: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: px2dp(30),
      height: px2dp(30),
      position: 'absolute',
      top: px2dp(1),
      right: px2dp(1),
      backgroundColor: '#000',
      opacity: 0.8
    }


})
