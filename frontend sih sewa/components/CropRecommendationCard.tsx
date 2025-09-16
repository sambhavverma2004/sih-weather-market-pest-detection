import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Leaf, Calendar, TrendingUp } from 'lucide-react-native';

interface CropRecommendationCardProps {
  language: string;
}

export default function CropRecommendationCard({ language }: CropRecommendationCardProps) {
  const recommendationTexts = {
    hindi: {
      title: 'फसल सुझाव',
      season: 'रबी सीजन के लिए बेहतरीन',
      crop: 'गेहूं',
      reason: 'मिट्टी और मौसम के अनुकूल',
      viewMore: 'और देखें'
    },
    english: {
      title: 'Crop Recommendations',
      season: 'Perfect for Rabi Season',
      crop: 'Wheat',
      reason: 'Suitable for soil & weather',
      viewMore: 'View More'
    },
    punjabi: {
      title: 'ਫਸਲ ਸੁਝਾਅ',
      season: 'ਰੱਬੀ ਸੀਜ਼ਨ ਲਈ ਵਧੀਆ',
      crop: 'ਕਣਕ',
      reason: 'ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੇ ਅਨੁਕੂਲ',
      viewMore: 'ਹੋਰ ਵੇਖੋ'
    }
  };

  const currentTexts = recommendationTexts[language] || recommendationTexts.english;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Leaf size={24} color="#22C55E" />
        <Text style={styles.title}>{currentTexts.title}</Text>
      </View>
      
      <View style={styles.recommendation}>
        <View style={styles.cropInfo}>
          <Text style={styles.cropName}>🌾 {currentTexts.crop}</Text>
          <Text style={styles.season}>{currentTexts.season}</Text>
          <Text style={styles.reason}>{currentTexts.reason}</Text>
        </View>
        
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Calendar size={16} color="#F59E0B" />
            <Text style={styles.metricLabel}>Nov-Mar</Text>
          </View>
          <View style={styles.metric}>
            <TrendingUp size={16} color="#22C55E" />
            <Text style={styles.metricLabel}>95% Match</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>{currentTexts.viewMore}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  recommendation: {
    marginBottom: 16,
  },
  cropInfo: {
    marginBottom: 12,
  },
  cropName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  season: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '600',
    marginBottom: 4,
  },
  reason: {
    fontSize: 14,
    color: '#6B7280',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  viewMoreButton: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
});