import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherForecastCardProps {
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: any;
  };
}

export default function WeatherForecastCard({ forecast }: WeatherForecastCardProps) {
  const { day, high, low, condition, icon: Icon } = forecast;

  return (
    <View style={styles.card}>
      <Text style={styles.day}>{day}</Text>
      <Icon size={32} color="#3B82F6" />
      <View style={styles.temperatureContainer}>
        <Text style={styles.highTemp}>{high}°</Text>
        <Text style={styles.lowTemp}>{low}°</Text>
      </View>
      <Text style={styles.condition}>{condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  day: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  highTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  lowTemp: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  condition: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});