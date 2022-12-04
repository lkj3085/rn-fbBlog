import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

let userId = '',
  name = '',
  profileUrl = '';

const AddNewBlog = ({navigation}) => {
  const [caption, setCaption] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    userId = await AsyncStorage.getItem('USERID');
    name = await AsyncStorage.getItem('NAME');
    let email = await AsyncStorage.getItem('EMAIL');
    firestore()
      .collection('Users')
      .where('email', '==', email)
      // .where('password', '==', password)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length === 0) {
          alert('User Not Exist');
        } else {
          console.log(querySnapshot.docs[0]._data);
          profileUrl = querySnapshot.docs[0]._data.profileImage;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const saveData = url => {
    firestore()
      .collection('Blogs')
      .add({
        caption: caption,
        name: name,
        userId: userId,
        blogImage: url,
        userImage: profileUrl,
      })
      .then(() => {
        console.log('success');
        navigation.goBack();
      });
  };

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    console.log(result);
    if (result.didCancel) {
    } else {
      setData(result);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '카메라 접근 허용',
          message: '안할 시 이미지 선택 불가' + '좋은 말 할때 수락',
          buttonNeutral: 'Ask me later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCamera();
        console.log('can use camera');
      } else {
        console.log('not use');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const uploadImage = async () => {
    const reference = storage().ref(data.assets[0].fileName);
    const pathToFile = data.assets[0].uri;

    await reference.putFile(pathToFile);
    const url = await storage().ref(data.assets[0].fileName).getDownloadURL();
    console.log(url);
    saveData(url);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="내용"
        value={caption}
        onChangeText={text => {
          setCaption(text);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          requestCameraPermission();
        }}
        style={styles.touchable2}>
        <Text style={styles.text}>Pick Image</Text>
      </TouchableOpacity>
      {data != null ? (
        <Image
          source={{uri: data.assets[0].uri}}
          style={{
            width: '90%',
            height: 200,
            alignSelf: 'center',
            paddingTop: 20,
          }}
        />
      ) : null}
      <TouchableOpacity
        onPress={() => {
          uploadImage();
        }}
        style={styles.touchable}>
        <Text style={styles.text}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewBlog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    marginTop: 50,
    alignSelf: 'center',
    borderWidth: 1,
    paddingLeft: 20,
  },
  touchable: {
    width: '90%',
    height: 50,
    backgroundColor: 'purple',
    marginTop: 50,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable2: {
    width: '90%',
    height: 50,
    backgroundColor: 'blue',
    marginTop: 50,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
