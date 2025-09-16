import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Volume2, Leaf, Thermometer, TrendingUp, MessageSquare } from 'lucide-react-native';
import VoiceButton from '@/components/VoiceButton';
import WeatherCard from '@/components/WeatherCard';
import CropRecommendationCard from '@/components/CropRecommendationCard';
import QuickActionCard from '@/components/QuickActionCard';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('hindi'); // hindi, english, punjabi

  const languageTexts = {
    hindi: {
      welcome: 'नमस्ते किसान भाई!',
      subtitle: 'आज का मौसम और सुझाव',
      quickActions: 'त्वरित सहायता',
      voicePrompt: 'बोलकर सहायता पाएं'
    },
    english: {
      welcome: 'Welcome Farmer!',
      subtitle: 'Today\'s Weather & Recommendations',
      quickActions: 'Quick Actions',
      voicePrompt: 'Get help by voice'
    },
    punjabi: {
      welcome: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਜੀ!',
      subtitle: 'ਅੱਜ ਦਾ ਮੌਸਮ ਤੇ ਸੁਝਾਅ',
      quickActions: 'ਤੁਰੰਤ ਸਹਾਇਤਾ',
      voicePrompt: 'ਬੋਲ ਕੇ ਸਹਾਇਤਾ ਲਓ'
    }
  };

  const currentTexts = languageTexts[language];

  const quickActions = [
    {
      id: '1',
      title: language === 'hindi' ? 'फसल सुझाव' : language === 'punjabi' ? 'ਫਸਲ ਸੁਝਾਅ' : 'Crop Advice',
      icon: Leaf,
      color: '#22C55E',
      action: () => Alert.alert('Feature', 'Crop recommendations will open')
    },
    {
      id: '2',
      title: language === 'hindi' ? 'मौसम अलर्ट' : language === 'punjabi' ? 'ਮੌਸਮ ਚੇਤਾਵਨੀ' : 'Weather Alert',
      icon: Thermometer,
      color: '#3B82F6',
      action: () => Alert.alert('Feature', 'Weather alerts will open')
    },
    {
      id: '3',
      title: language === 'hindi' ? 'बाज़ार दाम' : language === 'punjabi' ? 'ਬਾਜ਼ਾਰ ਰੇਟ' : 'Market Price',
      icon: TrendingUp,
      color: '#F59E0B',
      action: () => Alert.alert('Feature', 'Market prices will open')
    },
    {
      id: '4',
      title: language === 'hindi' ? 'AI सहायक' : language === 'punjabi' ? 'AI ਸਹਾਇਕ' : 'AI Assistant',
      icon: MessageSquare,
      color: '#8B5CF6',
      action: () => Alert.alert('Feature', 'AI chatbot will open')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>{currentTexts.welcome}</Text>
            <Text style={styles.subtitleText}>{currentTexts.subtitle}</Text>
          </View>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => {
              const languages = ['hindi', 'english', 'punjabi'];
              const currentIndex = languages.indexOf(language);
              const nextIndex = (currentIndex + 1) % languages.length;
              setLanguage(languages[nextIndex]);
            }}
          >
            <Text style={styles.languageButtonText}>
              {language === 'hindi' ? 'हिंदी' : language === 'punjabi' ? 'ਪੰਜਾਬੀ' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Voice Input */}
        <VoiceButton 
          isListening={isListening}
          onPress={() => setIsListening(!isListening)}
          promptText={currentTexts.voicePrompt}
        />

        {/* Weather Card */}
        <WeatherCard language={language} />

        {/* Crop Recommendations */}
        <CropRecommendationCard language={language} />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentTexts.quickActions}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                title={action.title}
                icon={action.icon}
                color={action.color}
                onPress={action.action}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
  },
  languageButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});