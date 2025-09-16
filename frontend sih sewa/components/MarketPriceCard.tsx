import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface MarketPriceCardProps {
  crop: {
    name: string;
    price: number;
    change: number;
    changePercent: number;
    unit: string;
    market: string;
  };
  onPress?: () => void;
}

export default function MarketPriceCard({ crop, onPress }: MarketPriceCardProps) {
  const getPriceChangeIcon = () => {
    if (crop.change > 0) return TrendingUp;
    if (crop.change < 0) return TrendingDown;
    return Minus;
  };

  const getPriceChangeColor = () => {
    if (crop.change > 0) return '#22C55E';
    if (crop.change < 0) return '#EF4444';
    return '#6B7280';
  };

  const Icon = getPriceChangeIcon();
  const color = getPriceChangeColor();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.cropName}>{crop.name}</Text>
        <View style={styles.priceChange}>
          <Icon size={16} color={color} />
          <Text style={[styles.changeText, { color }]}>
            {crop.change > 0 ? '+' : ''}{crop.changePercent}%
          </Text>
        </View>
      </View>
      
      <Text style={styles.price}>₹{crop.price}</Text>
      <Text style={styles.unit}>{crop.unit}</Text>
      <Text style={styles.market}>{crop.market}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  market: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});