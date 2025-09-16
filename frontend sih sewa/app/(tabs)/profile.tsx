import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Phone, Settings, Bell, Globe, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, Smartphone } from 'lucide-react-native';
import { Volume2 } from "lucide-react-native";
export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState('hindi');

  const userProfile = {
    name: 'राम सिंह / Ram Singh',
    phone: '+91 98765 43210',
    location: 'Village Khanna, Punjab',
    farmSize: '5 Acres / 5 एकड़',
    crops: ['गेहूं / Wheat', 'चावल / Rice', 'मक्का / Maize'],
    soilType: 'Alluvial / जलोढ़',
    registrationDate: 'January 2024'
  };

  const settingsOptions = [
    {
      icon: Bell,
      title: 'सूचनाएं / Notifications',
      subtitle: 'Weather alerts, market updates / मौसम अलर्ट, बाज़ार अपडेट',
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchToggle: setNotificationsEnabled
    },
    {
      icon: Volume2,
      title: 'आवाज़ सहायता / Voice Assistance',
      subtitle: 'Voice input and output / आवाज़ इनपुट और आउटपुट',
      hasSwitch: true,
      switchValue: voiceEnabled,
      onSwitchToggle: setVoiceEnabled
    },
    {
      icon: Globe,
      title: 'भाषा / Language',
      subtitle: `Current: ${language === 'hindi' ? 'हिंदी' : language === 'punjabi' ? 'ਪੰਜਾਬੀ' : 'English'}`,
      onPress: () => {
        Alert.alert(
          'भाषा चुनें / Select Language',
          'Choose your preferred language / अपनी पसंदीदा भाषा चुनें',
          [
            { text: 'हिंदी', onPress: () => setLanguage('hindi') },
            { text: 'ਪੰਜਾਬੀ', onPress: () => setLanguage('punjabi') },
            { text: 'English', onPress: () => setLanguage('english') },
            { text: 'Cancel / रद्द करें', style: 'cancel' }
          ]
        );
      }
    },
    {
      icon: Smartphone,
      title: 'ऑफलाइन मोड / Offline Mode',
      subtitle: 'Download data for offline use / ऑफलाइन उपयोग के लिए डेटा डाउनलोड करें',
      onPress: () => Alert.alert('Feature', 'Offline sync options will be available')
    },
    {
      icon: HelpCircle,
      title: 'सहायता / Help & Support',
      subtitle: 'FAQs, contact support / FAQ, सहायता संपर्क',
      onPress: () => Alert.alert('Support', 'Help center will open')
    },
    {
      icon: Settings,
      title: 'सेटिंग्स / Settings',
      subtitle: 'App preferences / ऐप वरीयताएं',
      onPress: () => Alert.alert('Settings', 'Advanced settings will open')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <View style={styles.profileDetail}>
                <Phone size={16} color="#6B7280" />
                <Text style={styles.profileDetailText}>{userProfile.phone}</Text>
              </View>
              <View style={styles.profileDetail}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.profileDetailText}>{userProfile.location}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={18} color="#22C55E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Farm Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>खेत की जानकारी / Farm Information</Text>
          <View style={styles.farmInfoCard}>
            <View style={styles.farmInfoRow}>
              <Text style={styles.farmInfoLabel}>Farm Size / खेत का आकार:</Text>
              <Text style={styles.farmInfoValue}>{userProfile.farmSize}</Text>
            </View>
            <View style={styles.farmInfoRow}>
              <Text style={styles.farmInfoLabel}>Soil Type / मिट्टी का प्रकार:</Text>
              <Text style={styles.farmInfoValue}>{userProfile.soilType}</Text>
            </View>
            <View style={styles.farmInfoRow}>
              <Text style={styles.farmInfoLabel}>Main Crops / मुख्य फसलें:</Text>
              <Text style={styles.farmInfoValue}>{userProfile.crops.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>सेटिंग्स / Settings</Text>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={option.onPress}
              disabled={option.hasSwitch}
            >
              <View style={styles.settingIcon}>
                <option.icon size={20} color="#6B7280" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
              </View>
              {option.hasSwitch ? (
                <Switch
                  value={option.switchValue}
                  onValueChange={option.onSwitchToggle}
                  trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                  thumbColor={option.switchValue ? '#22C55E' : '#F3F4F6'}
                />
              ) : (
                <View style={styles.settingArrow}>
                  <Text style={styles.settingArrowText}>›</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ऐप जानकारी / App Information</Text>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Member since / सदस्य बने:</Text>
              <Text style={styles.appInfoValue}>{userProfile.registrationDate}</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>App Version / ऐप संस्करण:</Text>
              <Text style={styles.appInfoValue}>1.0.0</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Last Sync / अंतिम सिंक:</Text>
              <Text style={styles.appInfoValue}>2 minutes ago</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>त्वरित कार्य / Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>📊</Text>
              <Text style={styles.quickActionText}>Usage Stats</Text>
              <Text style={styles.quickActionTextHindi}>उपयोग आंकड़े</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>💬</Text>
              <Text style={styles.quickActionText}>Feedback</Text>
              <Text style={styles.quickActionTextHindi}>प्रतिक्रिया</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>🌾</Text>
              <Text style={styles.quickActionText}>My Crops</Text>
              <Text style={styles.quickActionTextHindi}>मेरी फसलें</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionEmoji}>📱</Text>
              <Text style={styles.quickActionText}>Share App</Text>
              <Text style={styles.quickActionTextHindi}>ऐप शेयर करें</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'लॉग आउट / Logout',
              'Are you sure you want to logout? / क्या आप वाकई लॉग आउट करना चाहते हैं?',
              [
                { text: 'Cancel / रद्द करें', style: 'cancel' },
                { text: 'Logout / लॉग आउट', style: 'destructive' }
              ]
            );
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>लॉग आउट / Logout</Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  section: {
    margin: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  farmInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  farmInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  farmInfoLabel: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  farmInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingArrow: {
    paddingLeft: 16,
  },
  settingArrowText: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appInfoLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  appInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  quickActionTextHindi: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});