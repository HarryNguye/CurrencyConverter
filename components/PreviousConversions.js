import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');

export default function PreviousConversions() {
  const [conversions, setConversions] = useState([]);

  // Päivittää listan poiston jälkeen
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from conversions;`,
        [],
        (_, { rows }) => setConversions(rows._array),
        (txObj, error) => console.log('Error ', error)
      );
    });
  };

  useEffect(() => {
    updateList();
  }, []);

  // poistaa edellisen valuutanvaihdon
  const deleteConversion = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from conversions where id = ?;`, [id], (_, result) => {
          if (result.rowsAffected > 0) {
            updateList(); // refreshaa listan
          }
        });
      },
      (txObj, error) => console.log('Error when deleting conversion', error)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Previous Conversions</Text>
      {conversions.map((conv) => (
        <View key={conv.id} style={styles.conversionRow}>
          <Text style={styles.conversionText}>
            {conv.amount} {conv.fromCurrency} to {conv.convertedAmount} {conv.toCurrency}
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => deleteConversion(conv.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%', 
    padding: 10,
  },
  conversionText: {
    fontSize: 16,
    marginVertical: 5,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  }
});
