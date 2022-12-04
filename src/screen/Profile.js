import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

let userId = '';

const Profile = ({navigation}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    userId = await AsyncStorage.getItem('USERID');
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
    updateProfile(url);
  };

  const updateProfile = url => {
    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        profileImage: url,
      })
      .then(() => {
        console.log('User Update');
        navigation.goBack();
      });
  };

  return (
    <View style={{flex: 1}}>
      {data != null ? (
        <Image
          source={{uri: data.assets[0].uri}}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignSelf: 'center',
            marginTop: 50,
          }}
        />
      ) : (
        <Image
          source={require('../image/user.png')}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignSelf: 'center',
            marginTop: 50,
          }}
        />
      )}
      <TouchableOpacity
        style={{
          marginTop: 30,
          height: 50,
          width: '50%',
          borderWidth: 1,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        onPress={() => {
          requestCameraPermission();
        }}>
        <Text>Pick Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 30,
          height: 50,
          width: '50%',
          backgroundColor: 'purple',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        onPress={() => {
          uploadImage();
        }}>
        <Text style={{color: '#fff'}}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
