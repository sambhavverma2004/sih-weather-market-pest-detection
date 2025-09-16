import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, Wheat, Leaf, Cloud,Sprout } from 'lucide-react-native'; // Added some icons for crops
import MarketPriceCard from '@/components/MarketPriceCard';
import PriceChart from '@/components/PriceChart';
import axios from 'axios';

const API_URL = 'https://sewa-sih-2-0.onrender.com';

// --- NEW: Define a list of available crops ---
// In a real app, you might fetch this list from your API
const AVAILABLE_CROPS = [
  { label: 'Wheat / गेहूं', value: 'wheat', icon: Wheat },
  { label: 'Rice / चावल', value: 'rice', icon: Leaf },
  { label: 'Maize / मक्का', value: 'maize', icon: Sprout }, // Changed this line
  // Add more crops here as your API supports them
];

export default function MarketScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  
  // --- NEW: State to manage the selected crop ---
  const [selectedCrop, setSelectedCrop] = useState(AVAILABLE_CROPS[0].value); 

  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceHistory = [
    { date: '15 Sep', price: 2100 }, { date: '16 Sep', price: 2120 },
    { date: '17 Sep', price: 2080 }, { date: '18 Sep', price: 2150 },
    { date: '19 Sep', price: 2180 }, { date: '20 Sep', price: 2150 },
  ];

  // --- MODIFIED: Function now fetches data for the `selectedCrop` ---
  const fetchMarketData = useCallback(async () => {
    // Don't set loading to true on manual refresh, only on crop change
    if (!refreshing) {
        setLoading(true);
    }
    try {
      setError(null);
      // --- MODIFIED: The crop name in the URL is now dynamic ---
      const response = await axios.get(`${API_URL}/prices/punjab/${selectedCrop}`);
      
      if (response.data && response.data.success) {
        const currentCrop = AVAILABLE_CROPS.find(c => c.value === selectedCrop);
        const formattedData = response.data.market_prices.map((item: any, index: number) => ({
          id: `${item.market}-${index}`,
          // --- MODIFIED: Use the label from our crops list ---
          name: currentCrop?.label || selectedCrop,
          price: item.avg_price,
          change: 0, 
          changePercent: 0,
          unit: 'per quintal',
          market: item.market,
        }));

        setMarketData(formattedData);
        // Automatically select the first market if none is selected
        if (formattedData.length > 0) {
            setSelectedMarketId(formattedData[0].id);
        } else {
            setSelectedMarketId(null); // No data, so deselect
        }
      } else {
        setMarketData([]); // Clear data on failure
        setError(response.data.error || 'No data found for this crop.');
      }
    } catch (err) {
      setMarketData([]); // Clear data on error
      setError('Could not connect to the server. Please check your internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCrop, refreshing]); // --- MODIFIED: Add selectedCrop to dependencies ---

  // --- MODIFIED: useEffect now triggers when `selectedCrop` changes ---
  useEffect(() => {
    fetchMarketData();
  }, [selectedCrop]); // This will re-run the fetch whenever the user selects a new crop

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // The fetchMarketData will be called by the useEffect hook for `refreshing`
  }, []);

  useEffect(() => {
    if (refreshing) {
        fetchMarketData();
    }
  }, [refreshing, fetchMarketData]);


  // Helper functions remain the same...

  const selectedMarketData = marketData.find(crop => crop.id === selectedMarketId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#22C55E"]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>बाज़ार दाम / Market Prices</Text>
          <View style={styles.locationInfo}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>Punjab, India</Text>
            <Calendar size={16} color="#6B7280" style={{ marginLeft: 12 }} />
            <Text style={styles.date}>Today</Text>
          </View>
        </View>

        {/* --- NEW: Crop Selection Buttons --- */}
        <View style={styles.cropSelectorContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                {AVAILABLE_CROPS.map((crop) => {
                    const Icon = crop.icon;
                    const isActive = selectedCrop === crop.value;
                    return (
                        <TouchableOpacity
                            key={crop.value}
                            style={[styles.cropButton, isActive && styles.cropButtonActive]}
                            onPress={() => setSelectedCrop(crop.value)}
                        >
                            <Icon color={isActive ? '#FFFFFF' : '#374151'} size={20} />
                            <Text style={[styles.cropButtonText, isActive && styles.cropButtonTextActive]}>
                                {crop.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>

        {/* --- MODIFIED: Show a message if no data is available for a crop --- */}
        {loading ? (
            <View style={styles.centered}><ActivityIndicator size="large" color="#22C55E" /></View>
        ) : error ? (
            <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
        ) : marketData.length === 0 ? (
             <View style={styles.centered}><Text style={styles.errorText}>No market data available for {selectedCrop}.</Text></View>
        ) : (
          <>
            {/* Price Summary Cards (Now shows different markets for the selected crop) */}
            <Text style={styles.subHeaderTitle}>Markets / मंडियां</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.summaryScroll}
              contentContainerStyle={styles.summaryContainer}
            >
              {marketData.map((market) => (
                <TouchableOpacity
                  key={market.id}
                  style={[
                    styles.summaryCard,
                    selectedMarketId === market.id && styles.summaryCardActive
                  ]}
                  onPress={() => setSelectedMarketId(market.id)}
                >
                  <Text style={[
                    styles.cropName,
                    selectedMarketId === market.id && styles.cropNameActive
                  ]}>
                    {market.market}
                  </Text>
                  <Text style={[
                    styles.cropPrice,
                    selectedMarketId === market.id && styles.cropPriceActive
                  ]}>
                    ₹{market.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {selectedMarketData && (
              <View style={styles.cropDetailsSection}>
                <Text style={styles.sectionTitle}>
                  {selectedMarketData.name} - Price in {selectedMarketData.market}
                </Text>
                
                <View style={styles.cropDetailsCard}>
                  <View style={styles.priceHeader}>
                    <View>
                      <Text style={styles.currentPrice}>₹{selectedMarketData.price}</Text>
                      <Text style={styles.priceUnit}>{selectedMarketData.unit}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.marketInfo}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.marketName}>{selectedMarketData.market}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>
                Price Trend (7 days) / मूल्य रुझान (7 दिन)
              </Text>
              <PriceChart data={priceHistory} />
            </View>

            <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>
                    Market Analysis / बाज़ार विश्लेषण
                </Text>
                <View style={styles.analysisCard}>
                    <Text style={styles.analysisTitle}>
                    📈 Today's Market Insights / आज की बाज़ार जानकारी
                    </Text>
                    <Text style={styles.analysisText}>
                    • Analysis will update based on the selected crop.
                    </Text>
                </View>
            </View>

            <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>Quick Actions / त्वरित कार्य</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.quickActionButton}><Text style={styles.quickActionText}>🛒 Find Buyers</Text><Text style={styles.quickActionTextHindi}>खरीदार खोजें</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}><Text style={styles.quickActionText}>📱 Price Alerts</Text><Text style={styles.quickActionTextHindi}>मूल्य अलर्ट</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}><Text style={styles.quickActionText}>📊 Historical Data</Text><Text style={styles.quickActionTextHindi}>ऐतिहासिक डेटा</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}><Text style={styles.quickActionText}>🚛 Transportation</Text><Text style={styles.quickActionTextHindi}>परिवहन</Text></TouchableOpacity>
                </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


// --- MODIFIED: Added new styles for crop selector and adjusted others ---
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 40,
    minHeight: 200,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  // --- NEW: Styles for the Crop Selector ---
  cropSelectorContainer: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  cropButtonActive: {
    backgroundColor: '#22C55E', // A darker green for active state
  },
  cropButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  cropButtonTextActive: {
    color: '#FFFFFF',
  },
  // --- NEW: Sub-header for the markets list ---
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  summaryScroll: {
    // No specific styles needed here, just the container
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 120,
  },
  summaryCardActive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  cropName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  cropNameActive: {
    color: '#FFFFFF',
  },
  cropPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  cropPriceActive: {
    color: '#FFFFFF',
  },
   priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceChangeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  priceChangeTextActive: {
    color: '#FFFFFF',
  },
  cropDetailsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  cropDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  priceChangeDetail: {
    alignItems: 'flex-end',
  },
  priceChangeAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceChangePercent: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  marketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  marketName: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  chartSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  analysisSection: {
    padding: 20,
  },
  analysisCard: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
  },
  quickActionsSection: {
    padding: 20,
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
    borderWidth: 1,
    borderColor: '#E5E7EB'
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
});