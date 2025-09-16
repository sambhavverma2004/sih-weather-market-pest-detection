import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TriangleAlert as AlertTriangle, Info, Cloud } from 'lucide-react-native';

interface WeatherAlertProps {
  alert: {
    id: string;
    type: 'warning' | 'info' | 'danger';
    title: string;
    message: string;
    time: string;
  };
}

export default function WeatherAlert({ alert }: WeatherAlertProps) {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'warning':
        return AlertTriangle;
      case 'danger':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case 'warning':
        return '#F59E0B';
      case 'danger':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  const getAlertBackground = () => {
    switch (alert.type) {
      case 'warning':
        return '#FEF3C7';
      case 'danger':
        return '#FEE2E2';
      default:
        return '#EBF8FF';
    }
  };

  const Icon = getAlertIcon();

  return (
    <View style={[styles.alertCard, { backgroundColor: getAlertBackground() }]}>
      <View style={styles.alertHeader}>
        <Icon size={20} color={getAlertColor()} />
        <Text style={styles.alertTime}>{alert.time}</Text>
      </View>
      <Text style={[styles.alertTitle, { color: getAlertColor() }]}>
        {alert.title}
      </Text>
      <Text style={[styles.alertMessage, { color: getAlertColor() }]}>
        {alert.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});