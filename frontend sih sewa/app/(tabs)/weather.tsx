import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, MapPin, X, Thermometer, Info } from 'lucide-react-native';
import WeatherForecastCard from '@/components/WeatherForecastCard';
import * as Location from 'expo-location';

const PUNJAB_DISTRICTS = [
  { name: 'Amritsar', lat: 31.6340, lon: 74.8723 },
  { name: 'Barnala', lat: 30.3780, lon: 75.5461 },
  { name: 'Bathinda', lat: 30.2110, lon: 74.9455 },
  { name: 'Faridkot', lat: 30.6754, lon: 74.7543 },
  { name: 'Fatehgarh Sahib', lat: 30.6416, lon: 76.3934 },
  { name: 'Fazilka', lat: 30.4035, lon: 74.0253 },
  { name: 'Ferozepur', lat: 30.9254, lon: 74.6094 },
  { name: 'Gurdaspur', lat: 32.0404, lon: 75.4042 },
  { name: 'Hoshiarpur', lat: 31.5304, lon: 75.9099 },
  { name: 'Jalandhar', lat: 31.3260, lon: 75.5762 },
  { name: 'Kapurthala', lat: 31.3833, lon: 75.3833 },
  { name: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
  { name: 'Malerkotla', lat: 30.5246, lon: 75.8906 },
  { name: 'Mansa', lat: 29.9864, lon: 75.3900 },
  { name: 'Moga', lat: 30.8033, lon: 75.1733 },
  { name: 'Pathankot', lat: 32.2684, lon: 75.6511 },
  { name: 'Patiala', lat: 30.3398, lon: 76.3869 },
  { name: 'Rupnagar', lat: 30.9667, lon: 76.5333 },
  { name: 'S.A.S. Nagar (Mohali)', lat: 30.7046, lon: 76.7179 },
  { name: 'Sangrur', lat: 30.2520, lon: 75.8431 },
  { name: 'S.B.S. Nagar (Nawanshahr)', lat: 31.1249, lon: 76.1154 },
  { name: 'Sri Muktsar Sahib', lat: 30.4756, lon: 74.5204 },
  { name: 'Tarn Taran', lat: 31.4544, lon: 74.9242 },
];

const DistrictRow = React.memo(({ item, onPress }) => (
    <TouchableOpacity style={styles.cityRow} onPress={() => onPress(item)}>
        <Text style={styles.cityName}>{item.name}</Text>
    </TouchableOpacity>
));

const getWeatherInfoFromCode = (code: number) => {
    if (code >= 95) return { icon: CloudRain, condition: "Thunderstorm" };
    if (code >= 80) return { icon: CloudRain, condition: "Showers" };
    if (code >= 61) return { icon: CloudRain, condition: "Rain" };
    if (code >= 51) return { icon: CloudRain, condition: "Drizzle" };
    if (code > 3) return { icon: Cloud, condition: "Cloudy" };
    if (code === 3) return { icon: Cloud, condition: "Overcast" };
    if (code === 2) return { icon: Cloud, condition: "Partly Cloudy" };
    if (code === 1) return { icon: Sun, condition: "Mainly Clear" };
    if (code === 0) return { icon: Sun, condition: "Clear Sky" };
    return { icon: Cloud, condition: "Cloudy" };
};

// --- NEW --- Thresholds and advisory logic for irrigation
const HIGH_MOISTURE_THRESHOLD = 0.40; // Saturated
const LOW_MOISTURE_THRESHOLD = 0.18;  // Dry

const getIrrigationAdvisory = (moisture) => {
    if (moisture === null || moisture === undefined) return null;

    if (moisture > HIGH_MOISTURE_THRESHOLD) {
        return {
            text: "Soil is saturated. Avoid irrigation to prevent waterlogging.",
            style: styles.advisorySaturated
        };
    } else if (moisture < LOW_MOISTURE_THRESHOLD) {
        return {
            text: "Soil is dry. Irrigation is recommended soon.",
            style: styles.advisoryDry
        };
    } else {
        return {
            text: "Soil moisture is optimal. No immediate irrigation needed.",
            style: styles.advisoryOptimal
        };
    }
};

export default function WeatherScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [soilData, setSoilData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchWeatherData = useCallback(async (lat, lon) => {
        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_temperature_0cm,soil_temperature_6cm`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) throw new Error(data.reason);

            const formattedWeatherData = {
                current: {
                    temperature: Math.round(data.current.temperature_2m),
                    condition: getWeatherInfoFromCode(data.current.weather_code).condition,
                    humidity: data.current.relative_humidity_2m,
                    windSpeed: Math.round(data.current.wind_speed_10m),
                    visibility: data.current.visibility / 1000,
                    icon: getWeatherInfoFromCode(data.current.weather_code).icon,
                },
                forecast: data.daily.time.slice(1, 6).map((time, index) => ({
                    day: new Date(time).toLocaleDateString('en-US', { weekday: 'long' }),
                    high: Math.round(data.daily.temperature_2m_max[index + 1]),
                    low: Math.round(data.daily.temperature_2m_min[index + 1]),
                    condition: getWeatherInfoFromCode(data.daily.weather_code[index + 1]).condition,
                    icon: getWeatherInfoFromCode(data.daily.weather_code[index + 1]).icon,
                })),
            };
            setWeatherData(formattedWeatherData);
            
            const now = new Date();
            const currentHourIndex = data.hourly.time.findIndex(time => new Date(time) > now);
            
            const formattedSoilData = {
                moisture_0_1: data.hourly.soil_moisture_0_to_1cm[currentHourIndex],
                moisture_1_3: data.hourly.soil_moisture_1_to_3cm[currentHourIndex],
                temp_0: Math.round(data.hourly.soil_temperature_0cm[currentHourIndex]),
                temp_6: Math.round(data.hourly.soil_temperature_6cm[currentHourIndex]),
            };
            setSoilData(formattedSoilData);

        } catch (error) {
            Alert.alert('API Error', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Defaulting to Amritsar.');
                const defaultLocation = PUNJAB_DISTRICTS[0];
                setLocation(defaultLocation);
                fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
                return;
            }
            let locationData = await Location.getCurrentPositionAsync({});
            const detectedLocation = {
                name: 'My Location',
                lat: locationData.coords.latitude,
                lon: locationData.coords.longitude,
            }
            setLocation(detectedLocation);
            fetchWeatherData(detectedLocation.lat, detectedLocation.lon);
        })();
    }, [fetchWeatherData]);

    const onRefresh = () => {
        if (location) {
            setRefreshing(true);
            fetchWeatherData(location.lat, location.lon);
        }
    };

    const handleLocationSelect = useCallback((district) => {
        setLocation(district);
        fetchWeatherData(district.lat, district.lon);
        setModalVisible(false);
    }, [fetchWeatherData]);

    if (!weatherData || loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={{ marginTop: 10 }}>Fetching Weather & Soil Data...</Text>
            </SafeAreaView>
        );
    }
    
    const CurrentWeatherIcon = weatherData.current.icon;
    const irrigationAdvisory = getIrrigationAdvisory(soilData?.moisture_0_1); // --- NEW --- Get advisory for rendering

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select a District</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={PUNJAB_DISTRICTS}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => <DistrictRow item={item} onPress={handleLocationSelect} />}
                            initialNumToRender={15} 
                        />
                    </View>
                </View>
            </Modal>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>मौसम पूर्वानुमान / Weather Forecast</Text>
                    <TouchableOpacity style={styles.locationButton} onPress={() => setModalVisible(true)}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.location}> {location?.name}, India</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.currentWeatherCard}>
                    <View style={styles.currentWeatherMain}>
                        <CurrentWeatherIcon size={80} color="#3B82F6" />
                        <View style={styles.currentWeatherInfo}>
                            <Text style={styles.currentTemperature}>{weatherData.current.temperature}°C</Text>
                            <Text style={styles.currentCondition}>{weatherData.current.condition}</Text>
                        </View>
                    </View>
                    <View style={styles.currentWeatherDetails}>
                        <View style={styles.weatherDetailItem}>
                            <Droplets size={20} color="#3B82F6" />
                            <Text style={styles.weatherDetailLabel}>Humidity / आर्द्रता</Text>
                            <Text style={styles.weatherDetailValue}>{weatherData.current.humidity}%</Text>
                        </View>
                        <View style={styles.weatherDetailItem}>
                            <Wind size={20} color="#3B82F6" />
                            <Text style={styles.weatherDetailLabel}>Wind / हवा</Text>
                            <Text style={styles.weatherDetailValue}>{weatherData.current.windSpeed} km/h</Text>
                        </View>
                        <View style={styles.weatherDetailItem}>
                            <Eye size={20} color="#3B82F6" />
                            <Text style={styles.weatherDetailLabel}>Visibility / दृश्यता</Text>
                            <Text style={styles.weatherDetailValue}>{weatherData.current.visibility} km</Text>
                        </View>
                    </View>
                </View>
                
                {soilData && (
                    <View style={styles.currentWeatherCard}>
                        <Text style={styles.sectionTitle}>मिट्टी की स्थिति / Soil Conditions</Text>
                        <View style={[styles.currentWeatherDetails, {marginTop: 16}]}>
                            <View style={styles.weatherDetailItem}>
                                <Droplets size={20} color="#A16207" />
                                <Text style={styles.weatherDetailLabel}>Moisture (0-1cm) / नमी</Text>
                                <Text style={styles.weatherDetailValue}>{soilData.moisture_0_1.toFixed(3)} m³/m³</Text>
                            </View>
                            <View style={styles.weatherDetailItem}>
                                <Droplets size={20} color="#A16207" />
                                <Text style={styles.weatherDetailLabel}>Moisture (1-3cm) / नमी</Text>
                                <Text style={styles.weatherDetailValue}>{soilData.moisture_1_3.toFixed(3)} m³/m³</Text>
                            </View>
                        </View>
                        <View style={[styles.currentWeatherDetails, {marginTop: 24}]}>
                           <View style={styles.weatherDetailItem}>
                                <Thermometer size={20} color="#EF4444" />
                                <Text style={styles.weatherDetailLabel}>Temp (Surface) / तापमान</Text>
                                <Text style={styles.weatherDetailValue}>{soilData.temp_0}°C</Text>
                            </View>
                             <View style={styles.weatherDetailItem}>
                                <Thermometer size={20} color="#EF4444" />
                                <Text style={styles.weatherDetailLabel}>Temp (6cm) / तापमान</Text>
                                <Text style={styles.weatherDetailValue}>{soilData.temp_6}°C</Text>
                            </View>
                        </View>
                        
                        {/* --- NEW --- Irrigation Advisory Section --- */}
                        {irrigationAdvisory && (
                            <View style={styles.advisoryContainer}>
                                <View style={styles.advisoryTitleContainer}>
                                    <Info size={16} color="#4B5563" />
                                    <Text style={styles.advisoryTitle}>Irrigation Advisory / सिंचाई सलाह</Text>
                                </View>
                                <Text style={[styles.advisoryText, irrigationAdvisory.style]}>
                                    {irrigationAdvisory.text}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5-Day Forecast / 5 दिन का पूर्वानुमान</Text>
                    {weatherData.forecast.map((day, index) => (
                        <WeatherForecastCard key={index} forecast={day} />
                    ))}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 6,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  currentWeatherCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentWeatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentWeatherInfo: {
    marginLeft: 20,
    flex: 1,
  },
  currentTemperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
  },
  currentCondition: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 4,
  },
  currentWeatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  weatherDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  weatherDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
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
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  cityRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cityName: {
    fontSize: 18,
    color: '#374151',
  },
  // --- NEW STYLES for Advisory ---
  advisoryContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  advisoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  advisoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 8,
  },
  advisoryText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden', // Ensures border radius is applied to background color
  },
  advisoryOptimal: {
    backgroundColor: '#D1FAE5', // Green
    color: '#065F46',
  },
  advisoryDry: {
    backgroundColor: '#FEF3C7', // Orange/Yellow
    color: '#92400E',
  },
  advisorySaturated: {
    backgroundColor: '#DBEAFE', // Blue
    color: '#1E40AF',
  },
});