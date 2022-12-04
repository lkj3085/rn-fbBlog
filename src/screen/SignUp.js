import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const saveData = () => {
    const userId = uuid.v4();

    firestore()
      .collection('Users')
      .doc(userId)
      .set({
        name: name,
        userId: userId,
        email: email,
        password: password,
      })
      .then(() => {
        console.log('User Add');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Sign Up</Text>
      <TextInput
        placeholder="Name"
        style={styles.textInput}
        value={name}
        onChangeText={text => {
          setName(text);
        }}
      />
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={styles.textInput}
        value={password}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <TouchableOpacity
        style={styles.TouchableOpacity}
        onPress={() => {
          if (name != '' && email != '' && password != '') {
            saveData();
          } else alert('check Data');
        }}>
        <Text style={styles.TouchableOpacityText}>Sign Up</Text>
      </TouchableOpacity>
      <Text
        onPress={() => navigation.navigate('Login')}
        style={styles.navigation}>
        {'I Already Have Account'}
      </Text>
    </View>
  );
};

export default SignUp;

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
