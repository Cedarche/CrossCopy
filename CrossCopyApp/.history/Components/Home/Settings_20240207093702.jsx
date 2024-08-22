import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from './Styles/SharedStyles';
import { db, auth } from '../../Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function Settings({ paidUser }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.subContainer}>
        <ScrollView style={styles.mainContent}>
          <View>
            <Text>Settings</Text>
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Text</Text>
          <TouchableOpacity style={[styles.bottomButton, { marginRight: 5 }]}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
