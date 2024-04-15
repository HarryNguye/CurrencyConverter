import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import ModalDropdown from "react-native-modal-dropdown";
import * as SQLite from 'expo-sqlite';

const apiurl = 'http://api.exchangeratesapi.io/v1/';
const apikey = process.env.API_KEY;

const db = SQLite.openDatabase('coursedb.db');

export default function Converter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState('');

  // Fetchaa valuutat
  useEffect(() => {
    fetch(`${apiurl}latest?access_key=${apikey}`)
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(Object.keys(data.rates));
      })
      .catch((error) => {
        console.error('Error fetching currency data:', error);
        Alert.alert('Error', 'Failed to fetch currency data');
      });
  }, []);

  // Tekee table tietokantaan
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists conversions (
          id integer primary key not null, 
          fromCurrency text, 
          toCurrency text, 
          amount text, 
          convertedAmount text
        );`
      );
    }, (error) => console.error("Error when creating DB", error));
  }, []);

  // Jos input tyhjä nii valittaa
  const convertCurrency = useCallback(() => {
    if (!amount) {
      Alert.alert('Input required', 'Please enter the amount to convert');
      return;
    }
    
    fetch(`${apiurl}latest?access_key=${apikey}&base=${fromCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        const rate = data.rates[toCurrency];
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result.toFixed(2));

        // Tallentaa vaihdot tietokantaan
        db.transaction(tx => {
          tx.executeSql(
            'insert into conversions (fromCurrency, toCurrency, amount, convertedAmount) values (?, ?, ?, ?);', 
            [fromCurrency, toCurrency, amount, result.toFixed(2)],
            () => console.log("Conversion saved successfully"), 
            (error) => console.error("Error saving conversion", error)
          );
        });
      })
      .catch((error) => {
        console.error('Error converting currency:', error);
        Alert.alert('Error', 'Failed to convert currency');
      });
  }, [amount, fromCurrency, toCurrency]);

  // Vaihto valuutat päittäin
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
          placeholder='Enter amount'
          style={styles.input}
          keyboardType='numeric'
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <Text style={styles.label}>From currency:</Text>
        <ModalDropdown
          options={currencies}
          defaultValue={fromCurrency}
          onSelect={(index, value) => setFromCurrency(value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownDropdown}
        />
        <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapButtonText}>Swap Currencies</Text>
        </TouchableOpacity>
        <Text style={styles.label}>To currency:</Text>
        <ModalDropdown
          options={currencies}
          defaultValue={toCurrency}
          onSelect={(index, value) => setToCurrency(value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownDropdown}
        />
        <TouchableOpacity onPress={convertCurrency} style={styles.convertButton}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>
        {convertedAmount !== '' && (
          <Text style={styles.convertedAmount}>Converted Amount: {convertedAmount} {toCurrency}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    innerContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    label: {
      fontSize: 16,
      color: '#333',
      alignSelf: 'center',
    },
    input: {
      borderColor: '#007bff',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      width: '80%',
      fontSize: 18,
      backgroundColor: '#fff',
      alignSelf: 'center',
    },
    dropdown: {
      marginVertical: 10,
      width: '80%',
      padding: 10,
      borderColor: '#007bff',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#fff',
      alignSelf: 'center',
    },
    dropdownText: {
      fontSize: 18,
      color: '#333',
    },
    dropdownDropdown: {
      borderColor: '#007bff',
      borderWidth: 1,
      borderRadius: 3,
    },
    swapButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      alignSelf: 'center',
    },
    swapButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    convertButton: {
      backgroundColor: '#28a745',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      width: '80%',
      alignSelf: 'center',
    },
    convertButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    convertedAmount: {
      fontSize: 18,
      color: '#333',
      marginTop: 20,
      alignSelf: 'center',
    },
  });
  
