import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { AVAILABLE_QARIS } from '../utils/quranAudio';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { qari, setQari } = useSettings();

  const renderItem = ({ item }: { item: (typeof AVAILABLE_QARIS)[0] }) => (
    <Pressable
      style={[
        styles.itemContainer,
        qari === item.id && styles.selectedItemContainer,
      ]}
      onPress={() => setQari(item.id)}
    >
      <View style={styles.itemInfo}>
        <Text
          style={[styles.itemName, qari === item.id && styles.selectedItemText]}
        >
          {item.name}
        </Text>
      </View>
      {qari === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#00BFA5" />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pilih Qari (Pengisi Suara)</Text>
        <Text style={styles.sectionDescription}>
          Suara ini akan digunakan saat memutar audio murattal.
        </Text>

        <FlatList
          data={AVAILABLE_QARIS}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  listContainer: {
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  selectedItemContainer: {
    borderColor: '#00BFA5',
    backgroundColor: '#E0F2F1',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#00BFA5',
    fontWeight: '600',
  },
});
