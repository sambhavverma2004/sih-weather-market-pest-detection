import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayCircle } from 'lucide-react-native';
import WeatherCard from '@/components/WeatherCard';
import CropRecommendationCard from '@/components/CropRecommendationCard';

const KisanGyanCard = ({ title, description, thumbnail, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={thumbnail} style={styles.thumbnail} />
      <View style={styles.playIconContainer}>
        <PlayCircle color="#FFFFFF" size={40} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Placeholder images
const videoThumbnails = [
  { uri: 'https://placehold.co/400x250/EBF5E9/22C55E?text=Organic+Compost' },
  { uri: 'https://placehold.co/400x250/FDF6ED/F59E0B?text=Pest+Control' },
  { uri: 'https://placehold.co/400x250/E0F2FE/3B82F6?text=Soil+Testing' },
  { uri: 'https://placehold.co/400x250/FFF5F0/FB923C?text=Market+Price' },
  { uri: 'https://placehold.co/400x250/EDE9FE/7C3AED?text=Irrigation+Tips' },
  { uri: 'https://placehold.co/400x250/ECFDF5/10B981?text=Organic+Fertilizer' },
  { uri: 'https://placehold.co/400x250/FEF3C7/F59E0B?text=Seed+Selection' },
  { uri: 'https://placehold.co/400x250/FCE7F3/DB2777?text=Storage+Tips' },
  { uri: 'https://placehold.co/400x250/E0F2FE/3B82F6?text=Market+Trends' },
];

export default function HomeScreen() {
  const [language, setLanguage] = useState('hindi'); 
  const [showMore, setShowMore] = useState(false); 

  const scrollRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  const languageTexts = {
    hindi: {
      welcome: 'नमस्ते किसान भाई!',
      subtitle: 'आज का मौसम और सुझाव',
      knowledgeHub: 'किसान ज्ञान केंद्र',
      extraTitle: 'अतिरिक्त फसल सुझाव',
      extra: [
        'मिट्टी की नियमित जांच करें।',
        'बूँद सिंचाई और मल्चिंग अपनाएँ।',
        'दलहनी फसलों को cereals के बाद बोएं।',
        'कीट प्रबंधन के प्राकृतिक तरीके अपनाएँ।',
        'अपने क्षेत्र की जलवायु अनुसार फसल चुनें।'
      ],
      kcc: {
        title: '💳 किसान क्रेडिट कार्ड (KCC)',
        points: [
          '• आसान और सस्ता कृषि ऋण',
          '• ब्याज दर सिर्फ 4% (सब्सिडी के बाद)',
          '• फसल कटाई के बाद लचीला भुगतान'
        ],
        guide: '👉 आधिकारिक गाइड देखें',
        loan: '👉 आवेदन पत्र डाउनलोड करें'
      },
      ticker: [
        'प्रधानमंत्री किसान सम्मान निधि योजना अपडेट',
        'कृषि मौसम चेतावनी: अगले 3 दिन बारिश की संभावना',
        'धान का बाजार भाव: ₹2100 प्रति क्विंटल',
        'गेहूं में प्राकृतिक कीट प्रबंधन टिप्स',
        'सब्सिडी वाली सौर पंप योजना',
        'नई जैविक खाद तकनीक',
        'मिट्टी परीक्षण अभियान: अपना फसल पोषण जाँचें',
        'कृषि ऋण के लिए आसान ऑनलाइन आवेदन'
      ]
    },
    english: {
      welcome: 'Welcome Farmer!',
      subtitle: "Today's Weather & Recommendations",
      knowledgeHub: 'Farmer Knowledge Hub',
      extraTitle: 'Additional Crop Recommendations',
      extra: [
        'Regularly test your soil for nutrients.',
        'Adopt drip irrigation and mulching.',
        'Rotate legumes after cereals.',
        'Use natural pest management methods.',
        'Choose crops suited to your climate.'
      ],
      kcc: {
        title: '💳 Kisan Credit Card (KCC)',
        points: [
          '• Easy & affordable crop loans',
          '• Interest rate only 4% (after subsidy)',
          '• Flexible repayment after harvest'
        ],
        guide: '👉 View Official Guide',
        loan: '👉 Download Loan Application'
      },
      ticker: [
        'PM Kisan Samman Nidhi latest updates',
        'Weather alert: Rain expected next 3 days',
        'Paddy market price: ₹2100 per quintal',
        'Natural pest management tips for wheat',
        'Subsidized solar pump scheme',
        'New organic compost techniques',
        'Soil testing campaign: check crop nutrition',
        'Easy online application for crop loan'
      ]
    },
    punjabi: {
      welcome: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਜੀ!',
      subtitle: 'ਅੱਜ ਦਾ ਮੌਸਮ ਤੇ ਸੁਝਾਅ',
      knowledgeHub: 'ਕਿਸਾਨ ਗਿਆਨ ਕੇਂਦਰ',
      extraTitle: 'ਵਾਧੂ ਫਸਲ ਸੁਝਾਅ',
      extra: [
        'ਮਿੱਟੀ ਦੀ ਨਿਯਮਿਤ ਜਾਂਚ ਕਰੋ।',
        'ਟਪੀਕ ਸਿੰਚਾਈ ਅਤੇ ਮਲਚਿੰਗ ਅਪਣਾਓ।',
        'ਅਨਾਜ ਤੋਂ ਬਾਅਦ ਦਾਲਾਂ ਵਗੈਰਾ ਬੀਜੋ।',
        'ਕੀੜੇ ਪ੍ਰਬੰਧਨ ਦੇ ਕੁਦਰਤੀ ਤਰੀਕੇ ਵਰਤੋ।',
        'ਆਪਣੇ ਖੇਤਰ ਦੀ ਆਬੋਹਵਾ ਮੁਤਾਬਕ ਫਸਲ ਚੁਣੋ।'
      ],
      kcc: {
        title: '💳 ਕਿਸਾਨ ਕਰੈਡਿਟ ਕਾਰਡ (KCC)',
        points: [
          '• ਆਸਾਨ ਅਤੇ ਸਸਤਾ ਖੇਤੀਬਾੜੀ ਕਰਜ਼ਾ',
          '• ਸੂਦ ਦਰ ਸਿਰਫ 4% (ਸਬਸਿਡੀ ਬਾਅਦ)',
          '• ਫਸਲ ਕਟਾਈ ਤੋਂ ਬਾਅਦ ਲਚਕੀਲਾ ਭੁਗਤਾਨ'
        ],
        guide: '👉 ਸਰਕਾਰੀ ਗਾਈਡ ਵੇਖੋ',
        loan: '👉 ਲੋਨ ਅਪਲੀਕੇਸ਼ਨ ਡਾਊਨਲੋਡ ਕਰੋ'
      },
      ticker: [
        'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਨਮਾਨ ਨిధੀ ਅਪਡੇਟ',
        'ਮੌਸਮ ਚੇਤਾਵਨੀ: ਅਗਲੇ 3 ਦਿਨਾਂ ਵਿੱਚ ਮੀਂਹ',
        'ਧਾਨ ਦਾ ਬਾਜ਼ਾਰ ਮੁੱਲ: ₹2100 ਪ੍ਰਤੀ ਕਵਿੰਟਾਲ',
        'ਗੰਹੁ ਵਿੱਚ ਕੁਦਰਤੀ ਕੀੜੇ ਪ੍ਰਬੰਧਨ ਟਿਪਸ',
        'ਸਬਸਿਡੀ ਵਾਲਾ ਸੂਰਜੀ ਪੰਪ ਯੋਜਨਾ',
        'ਨਵੀਂ ਜੈਵਿਕ ਖਾਦ ਤਕਨੀਕ',
        'ਮਿੱਟੀ ਟੈਸਟਿੰਗ ਮੁਹਿੰਮ: ਫਸਲ ਪੋਸ਼ਣ ਜਾਣੋ',
        'ਖੇਤੀ ਕਰਜ਼ਾ ਲਈ ਆਸਾਨ ਆਨਲਾਈਨ ਅਰਜ਼ੀ'
      ]
    }
  };

  const kisanGyanContent = [
    { id: '1', title: language==='hindi'?'जैविक खाद कैसे बनाएं':language==='punjabi'?'ਜੈਵਿਕ ਖਾਦ ਕਿਵੇਂ ਬਣਾਇਆ ਜਾਵੇ':'How to Make Organic Compost', description: language==='hindi'?'रासायनिक खादों का उपयोग कम करें और अपनी मिट्टी को स्वस्थ बनाएं।':language==='punjabi'?'ਰਸਾਇਣਕ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਘਟਾਓ ਅਤੇ ਆਪਣੀ ਮਿੱਟੀ ਨੂੰ ਸਿਹਤਮੰਦ ਬਣਾਓ।':'Reduce chemical use and improve soil health with organic compost.', thumbnail: videoThumbnails[0], link:'https://youtu.be/mkb_iHgKro4?si=kC7BXJ4uDih3qFcl' },
    { id: '2', title: language==='hindi'?'प्राकृतिक कीट नियंत्रण':language==='punjabi'?'ਕੁਦਰਤੀ ਕੀੜੇ ਕੰਟਰੋਲ':'Natural Pest Control', description: language==='hindi'?'कीटनाशकों के बिना अपनी फसलों को कीटों से बचाएं।':language==='punjabi'?'ਕੀਟਨਾਸ਼ਕਾਂ ਤੋਂ ਬਿਨਾਂ ਆਪਣੀਆਂ ਫਸਲਾਂ ਨੂੰ ਕੀਟਾਂ ਤੋਂ ਬਚਾਓ।':'Protect your crops from pests without harmful pesticides.', thumbnail: videoThumbnails[1], link:'https://youtu.be/jB9fhrmkx80?si=uKuuClgXoFXhoBfW' },
    { id: '3', title: language==='hindi'?'मिट्टी की जांच क्यों जरूरी?':language==='punjabi'?'ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕਿਉਂ ਜ਼ਰੂਰੀ?':'Why Soil Testing is Important?', description: language==='hindi'?'सही पोषक तत्वों की मात्रा जानें और फसल की पैदावार बढ़ाएं।':language==='punjabi'?'ਸਹੀ ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਦੀ ਮਾਤਰਾ ਜਾਣੋ ਅਤੇ ਫਸਲ ਦੀ ਪੈਦਾਵਾਰ ਵਧਾਓ।':'Learn about nutrient levels to maximize your crop yield.', thumbnail: videoThumbnails[2], link:'https://youtu.be/xJKMhmBqgRA?si=mvcYni1cyYR1Upwl' },
    { id: '4', title: language==='hindi'?'धान का बाजार भाव':language==='punjabi'?'ਧਾਨ ਦਾ ਬਾਜ਼ਾਰ ਮੁੱਲ':'Paddy Market Price', description: language==='hindi'?'आज का मंडी भाव देखें और अपने निर्णय लें।':language==='punjabi'?'ਅੱਜ ਦਾ ਬਾਜ਼ਾਰ ਮੁੱਲ ਵੇਖੋ ਅਤੇ ਫੈਸਲਾ ਕਰੋ।':'Check today’s market price to make informed decisions.', thumbnail: videoThumbnails[3], link:'https://www.agmarknet.gov.in/' },
    { id: '5', title: language==='hindi'?'सिंचाई सुझाव':language==='punjabi'?'ਸਿੰਚਾਈ ਸੁਝਾਅ':'Irrigation Tips', description: language==='hindi'?'जल का कुशल उपयोग करने के तरीके।':language==='punjabi'?'ਪਾਣੀ ਦੀ ਸਮਰਥ ਵਰਤੋਂ ਦੇ ਤਰੀਕੇ।':'Ways to use water efficiently.', thumbnail: videoThumbnails[4], link:'https://www.indiawaterportal.org/' },
    { id: '6', title: language==='hindi'?'जैविक उर्वरक':language==='punjabi'?'ਜੈਵਿਕ ਖਾਦ':'Organic Fertilizer', description: language==='hindi'?'रासायनिक उर्वरकों के बिना फसल बढ़ाएं।':language==='punjabi'?'ਰਸਾਇਣਕ ਖਾਦਾਂ ਦੇ ਬਿਨਾਂ ਫਸਲ ਵਧਾਓ।':'Increase yield without chemical fertilizers.', thumbnail: videoThumbnails[5], link:'https://www.fao.org/' },
    { id: '7', title: language==='hindi'?'बीज चयन':language==='punjabi'?'ਬੀਜ ਚੋਣ':'Seed Selection', description: language==='hindi'?'फसल के लिए उत्तम बीज चुनें।':language==='punjabi'?'ਫਸਲ ਲਈ ਚੰਗੇ ਬੀਜ ਚੁਣੋ।':'Select best seeds for your crop.', thumbnail: videoThumbnails[6], link:'https://www.seednet.gov.in/' },
    { id: '8', title: language==='hindi'?'भंडारण सुझाव':language==='punjabi'?'ਸਟੋਰੇਜ ਸੁਝਾਅ':'Storage Tips', description: language==='hindi'?'फसल को सही तरीके से भंडारित करें।':language==='punjabi'?'ਫਸਲ ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਸਟੋਰ ਕਰੋ।':'Store your harvest properly.', thumbnail: videoThumbnails[7], link:'https://www.fao.org/' },
    { id: '9', title: language==='hindi'?'बाज़ार प्रवृत्तियाँ':language==='punjabi'?'ਬਾਜ਼ਾਰ ਰੁਝਾਨ':'Market Trends', description: language==='hindi'?'मंडी के रुझान पर नजर रखें।':language==='punjabi'?'ਮੰਡੀ ਦੇ ਰੁਝਾਨ ਤੇ ਧਿਆਨ ਰੱਖੋ।':'Keep track of market trends.', thumbnail: videoThumbnails[8], link:'https://www.agmarknet.gov.in/' },
  ];

  const currentTexts = languageTexts[language];

  // Ticker Animation
  const [tickerWidth, setTickerWidth] = useState(0);
  const scrollAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    if (tickerWidth === 0) return;

    const animateTicker = () => {
      scrollAnim.setValue(screenWidth);
      Animated.timing(scrollAnim, {
        toValue: -tickerWidth,
        duration: 60000, // slower for better readability
        useNativeDriver: true,
        isInteraction: false,
      }).start(() => animateTicker());
    };

    animateTicker();
  }, [tickerWidth, scrollAnim, currentTexts]);

  // Horizontal scroll buttons
  const scrollBy = (offset) => {
    scrollRef.current?.scrollTo({ x: offset, animated: true });
  };

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

        {/* Kisan Gyan Kendra Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentTexts.knowledgeHub}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => scrollBy(-screenWidth)} style={styles.scrollButton}>
              <Text style={{fontSize: 20}}>{'<'}</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {kisanGyanContent.map(item => (
                <KisanGyanCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  thumbnail={item.thumbnail}
                  onPress={() => Linking.openURL(item.link)}
                />
              ))}

              {/* KCC Scheme Box */}
              <View style={styles.schemeBox}>
                <Text style={styles.schemeTitle}>{currentTexts.kcc.title}</Text>
                {currentTexts.kcc.points.map((p, i) => (
                  <Text key={i} style={styles.schemeText}>{p}</Text>
                ))}
                <TouchableOpacity onPress={() => Linking.openURL("https://www.jansamarth.in/kisan-credit-card-scheme")}>
                  <Text style={styles.schemeLink}>{currentTexts.kcc.guide}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL("https://pmkisan.gov.in/documents/Kcc.pdf")}>
                  <Text style={styles.schemeLink}>{currentTexts.kcc.loan}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => scrollBy(screenWidth)} style={styles.scrollButton}>
              <Text style={{fontSize: 20}}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrolling Ticker */}
        <View style={styles.tickerContainer}>
          <Animated.Text
            onLayout={(e) => setTickerWidth(e.nativeEvent.layout.width)}
            style={[styles.tickerText, { transform: [{ translateX: scrollAnim }] }]}
          >
            {currentTexts.ticker.join('     ||     ')}     ||     
          </Animated.Text>
        </View>

        {/* Weather Card */}
        <WeatherCard language={language} />

        {/* Crop Recommendations */}
        <CropRecommendationCard 
          language={language} 
          onViewMore={() => setShowMore(!showMore)} 
        />

        {/* Dropdown extra info */}
        {showMore && (
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownTitle}>{currentTexts.extraTitle}</Text>
            {currentTexts.extra.map((tip, index) => (
              <Text key={index} style={styles.dropdownItem}>• {tip}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20,
    backgroundColor: '#FFFFFF', marginBottom: 10,
  },
  headerContent: { flex: 1 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  subtitleText: { fontSize: 16, color: '#6B7280' },
  languageButton: { backgroundColor: '#22C55E', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  languageButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  section: { paddingBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16, paddingHorizontal: 20 },
  horizontalScroll: { paddingHorizontal: 10 },
  card: {
    width: 200, marginRight: 16, borderRadius: 12, backgroundColor: '#FFFFFF',
    overflow: 'hidden', elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  thumbnail: { width: '100%', height: 120, resizeMode: 'cover' },
  playIconContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  textContainer: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  cardDescription: { fontSize: 12, color: '#6B7280' },
  dropdownBox: {
    marginHorizontal: 20, marginTop: -10, marginBottom: 20,
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  dropdownTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  dropdownItem: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  schemeBox: {
    width: 200, marginLeft: 10, backgroundColor: '#FFF',
    borderRadius: 12, padding: 12, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  schemeTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6, color: '#1F2937' },
  schemeText: { fontSize: 12, color: '#4B5563', marginBottom: 4 },
  schemeLink: { fontSize: 12, color: '#2563EB', fontWeight: '600', marginTop: 4 },
  scrollButton: { padding: 10, backgroundColor:'#D1FAE5', borderRadius: 8, marginHorizontal: 2 },
  tickerContainer: {
    width: '100%',
    backgroundColor: '#A7F3D0',
    paddingVertical: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tickerText: {
    fontSize: 16,
    color: '#7C4519',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
});
