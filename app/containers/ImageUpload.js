/**
 *
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
import Icon from "react-native-vector-icons/Ionicons"
import  { uploadPhoto }  from '../components/Fetch';


const {width} = Dimensions.get('window');


export default class ImageUpload extends Component {
  static navigationOptions = {
    title: '图片',
    // header: null,
    // gesturesEnabled: false
  };
  constructor(props) {
    super(props);

    this.state = {
       photos: []
    }
    this.fileUrl = [];
    this.fileName = [];

  }

  componentDidMount(){

    }

    handleOpenImagePicker = () => {
         SYImagePicker.showImagePicker({imageCount: 9, isRecordSelected: true}, (err, photos) => {
             console.log(err, photos);
             if (!err) {
                 this.setState({
                     photos
                 })
             }
         })
     };

     /**
      * 使用方式sync/await
      * 相册参数暂时只支持默认参数中罗列的属性；
      * @returns {Promise<void>}
      */
     handleAsyncSelectPhoto = async () => {
         SYImagePicker.removeAllPhoto()
         try {
             const photos = await SYImagePicker.asyncShowImagePicker({imageCount: 1, isCrop: true, showCropCircle: true});
             // 选择成功
             this.setState({
                 photos: [...this.state.photos, ...photos]
             })
         } catch (err) {
             // 取消选择，err.message为"取消"
         }
     };

     handlePromiseSelectPhoto = () => {
         SYImagePicker.asyncShowImagePicker({imageCount: 3, enableBase64: true})
             .then(photos => {
                 console.log(photos);
                 const arr = photos.map(v=>{
                     return { ...v, enableBase64:true}
                 });
                 // 选择成功
                 this.setState({
                     photos: [...this.state.photos, ...arr]
                 })
             })
             .catch(err => {
                 // 取消选择，err.message为"取消"
             })
     };

     handleLaunchCamera = () => {
         SYImagePicker.openCamera({
           isCrop: false,
           showCropFrame: false
         }, (err, photos) => {
             console.log(err, photos);
             if (!err) {
                 this.setState({
                     photos: [...this.state.photos, ...photos]
                 })
             }
         })
     };

     handleDeleteCache = () => {
         SYImagePicker.deleteCache();
     };

     handleRemoveAllPhoto = (index) =>{
        const { photos: oldPhotos } = this.state;
        const photos = oldPhotos.filter((photo, photoIndex) => photoIndex !== index);
        console.log(photos);
        // 更新原生图片数组
        SYImagePicker.removePhotoAtIndex(index);
        // 更新 RN 页面
        this.setState({ photos });
     }

     handleUpload = () => {
       const { photos } = this.state;

        uploadPhoto(photos,(res)=>{
          console.log(res);
        });

       for (let p of photos) {
         this.uploadImage(p);
       }
       //console.log(this.fileUrl+"--"+this.fileName)
     }
     uploadImage(imgFile){

       let formData = new FormData();
          const fileUlI = imgFile.uri;
          const name = fileUlI.split('/');
          const file = {
              uri: imgFile.uri,
              type: 'image/jpeg',
              name: name[name.length-1]
            }
          formData.append("file",file);
          console.log(formData);
          let options ={};
          options.body = formData;
          options.headers={"Content-Type":"multipart/form-data"};
          options.method='POST';
          options.credentials = 'same-origin';
          var url = "http://cosmolimsapp.haier.net/limsrest/file/file";
          fetch(url,options)
          .then((response)=> {
            console.log("response==========",response);
            return response.json()
          })
          .then((responseData)=>{

            console.log(responseData);
            this.fileUrl.push(responseData.msg);
            this.fileName.push(name[name.length-1]);
            console.log(this.fileUrl+"--"+this.fileName)

          }).catch((error) => { console.log(error); }) .done();

    }
  render() {
      const {photos} = this.state;
      console.log(PixelRatio.get(),PixelRatio.getPixelSizeForLayoutSize(200),);
      return (
        <View style={styles.container}>
                <View style={styles.scroll}>
                    <Button title={'拍照'} onPress={this.handleLaunchCamera}/>
                    <Button title={'选择照片'} onPress={this.handleOpenImagePicker}/>
                    <Button title={'选择照片(Async)'} onPress={this.handleAsyncSelectPhoto}/>
                    <Button title={'选择照片(Promise)带base64'} onPress={this.handlePromiseSelectPhoto}/>
                    <Button title={'缓存清除'} onPress={this.handleDeleteCache}/>
                    <Button title={'上传'} onPress={this.handleUpload}/>
                </View>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.scroll}>
                    {photos.map((photo, index) => {
                        let source = { uri: photo.uri };
                        if (photo.enableBase64) {
                            source = { uri: photo.base64 };
                        }

                        return (
                          <View key={`image-${index}`} style={[styles.avatar, styles.avatarContainer]}>
                            <Image
                                resizeMode='cover'
                                style={styles.avatar}
                                source={source}
                            />
                            <TouchableOpacity onPress={()=>this.handleRemoveAllPhoto(index)} style={styles.delete}>
                              <Icon size={15} color="#fff"  name="md-close" />
                            </TouchableOpacity>
                          </View>
                        )
                    })}
                    <View style={{

                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      //backgroundColor: 'powderblue',
                      width: px2dp(160),
                      height: px2dp(160),
                      borderColor: '#d9d9d9',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      margin: px2dp(10),
                    }}>
                      <Icon size={FONT_SIZE(40)} color="#d9d9d9"  name="md-image" />
                      <Text style={{fontSize: FONT_SIZE(10),color: '#999'}}>添加图片</Text>
                    </View>
                </ScrollView>
            </View>

      )

  }

}

const Button = ({title, onPress}) => {
    return (
        <TouchableOpacity
            style={styles.btn}
            onPress={onPress}
        >
            <Text style={{color: '#fff', fontSize: 16}}>{title}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    btn: {
       backgroundColor: '#FDA549',
       justifyContent: 'center',
       alignItems: 'center',
       height: 44,
       paddingHorizontal: 12,
       margin: 5,
       borderRadius: 22
   },
   scroll: {
       padding: 5,
       flexWrap: 'wrap',
       flexDirection: 'row'
   },
   avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
   },
    avatar: {
        width: px2dp(160),
        height: px2dp(160),
        margin: px2dp(10),
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
