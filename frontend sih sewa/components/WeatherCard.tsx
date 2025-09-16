import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cloud, Droplets, Wind } from 'lucide-react-native';

interface WeatherCardProps {
  language: string;
}

export default function WeatherCard({ language }: WeatherCardProps) {
  const weatherTexts = {
    hindi: {
      title: 'आज का मौसम',
      condition: 'आंशिक बादल',
      humidity: 'आर्द्रता',
      wind: 'हवा की गति'
    },
    english: {
      title: 'Today\'s Weather',
      condition: 'Partly Cloudy',
      humidity: 'Humidity',
      wind: 'Wind Speed'
    },
    punjabi: {
      title: 'ਅੱਜ ਦਾ ਮੌਸਮ',
      condition: 'ਅੰਸ਼ਿਕ ਬੱਦਲ',
      humidity: 'ਨਮੀ',
      wind: 'ਹਵਾ ਦੀ ਗਤੀ'
    }
  };

  const currentTexts = weatherTexts[language] || weatherTexts.english;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{currentTexts.title}</Text>
      <View style={styles.weatherMain}>
        <Cloud size={48} color="#3B82F6" />
        <View style={styles.weatherInfo}>
          <Text style={styles.temperature}>28°C</Text>
          <Text style={styles.condition}>{currentTexts.condition}</Text>
        </View>
      </View>
      <View style={styles.weatherDetails}>
        <View style={styles.detailItem}>
          <Droplets size={16} color="#3B82F6" />
          <Text style={styles.detailLabel}>{currentTexts.humidity}</Text>
          <Text style={styles.detailValue}>65%</Text>
        </View>
        <View style={styles.detailItem}>
          <Wind size={16} color="#3B82F6" />
          <Text style={styles.detailLabel}>{currentTexts.wind}</Text>
          <Text style={styles.detailValue}>12 km/h</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherInfo: {
    marginLeft: 16,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  condition: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
});