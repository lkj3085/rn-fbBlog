import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
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
          if (querySnapshot.docs[0]._data.password === password) {
            saveData(
              querySnapshot.docs[0]._data.name,
              querySnapshot.docs[0]._data.userId,
            );
          } else {
            alert('Password Incorrect');
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const saveData = async (name, userId) => {
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('USERID', userId);
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={styles.textInput}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.TouchableOpacity}
        onPress={() => {
          signIn();
        }}>
        <Text style={styles.TouchableOpacityText}>Login</Text>
      </TouchableOpacity>
      <Text
        onPress={() => navigation.navigate('SignUp')}
        style={styles.navigation}>
        {'Go To Create Account'}
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 100,
  },
  textInput: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 20,
  },
  TouchableOpacity: {
    marginTop: 20,
    width: '90%',
    height: 50,
    backgroundColor: 'purple',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  TouchableOpacityText: {
    color: '#fff',
    fontSize: 18,
  },
  navigation: {
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 60,
    alignSelf: 'center',
  },
});
