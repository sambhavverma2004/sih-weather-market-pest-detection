import * as ImagePicker from 'expo-image-picker';
// REMOVED: import * as FileSystem from 'expo-file-system';
// --- NEW: Import Platform to check if we are on web or native ---
import { Platform } from 'react-native';

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, Scan, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';

const API_URL = "https://anmol1357-crop-disease.hf.space/predict";

export default function PestDetectionScreen() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageSelection = async (source: 'camera' | 'gallery') => {
    let result: ImagePicker.ImagePickerResult;
    
    if (source === 'camera') {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPerm.granted) {
        Alert.alert("Permission Required", "Camera access is needed to take photos of crops.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    } else {
      const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!mediaPerm.granted) {
        Alert.alert("Permission Required", "Photo library access is needed to upload crop images.");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        quality: 0.8 
      });
    }

    if (!result.canceled) {
      const imageAsset = result.assets[0];
      setSelectedImage(imageAsset);
      setAnalysisResult(null);
      setIsAnalyzing(true);

      const formData = new FormData();

      try {
        // --- THE FINAL FIX: Platform-specific FormData handling ---
        if (Platform.OS === 'web') {
          // On web, we fetch the blob from the picker's URI
          const response = await fetch(imageAsset.uri);
          const blob = await response.blob();
          formData.append('image', blob, 'photo.jpg');
        } else {
          // On native, we use the URI directly
          const uriParts = imageAsset.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          formData.append('image', {
            uri: imageAsset.uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          } as any);
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                // On web, the browser sets the Content-Type header with boundary automatically.
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status: ${response.status}. Message: ${errorText}`);
        }
        
        const responseJson = await response.json();
        const predictionData = responseJson.all_predictions;

        if (predictionData) {
          const topClass = Object.keys(predictionData).reduce((a, b) => predictionData[a] > predictionData[b] ? a : b);
          const confidence = predictionData[topClass] * 100;
          
          setAnalysisResult({
            disease: topClass,
            diseaseHindi: 'AI द्वारा पहचाना गया',
            confidence: confidence.toFixed(0),
            severity: 'moderate',
            treatment: {
              english: 'Consult with a local agricultural expert for specific treatment.',
              hindi: 'विशिष्ट उपचार के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।',
            },
            prevention: {
                english: 'Follow best practices for crop health and regular monitoring.',
                hindi: 'फसल स्वास्थ्य और नियमित निगरानी के लिए सर्वोत्तम प्रथाओं का पालन करें।',
            },
          });
        } else {
            throw new Error("No predictions found in the response.");
        }
      } catch (error) {
        console.error("API Error:", error);
        Alert.alert("Analysis Failed", "Could not get a prediction from the AI model. Please try again.");
        setAnalysisResult(null);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // --- No other changes are needed below this line ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
          <Text style={styles.title}>कीट और रोग पहचान / Pest & Disease Detection</Text>
          <Text style={styles.subtitle}>AI-powered crop analysis / AI से फसल विश्लेषण</Text>
        </View>
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Crop Image / फसल की तस्वीर अपलोड करें</Text>
          <View style={styles.uploadOptions}>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => handleImageSelection('camera')}
            >
              <Camera size={32} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
              <Text style={styles.uploadButtonTextHindi}>तस्वीर लें</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.uploadButton, styles.uploadButtonSecondary]}
              onPress={() => handleImageSelection('gallery')}
            >
              <Upload size={32} color="#22C55E" />
              <Text style={[styles.uploadButtonText, { color: '#22C55E' }]}>Upload Image</Text>
              <Text style={[styles.uploadButtonTextHindi, { color: '#22C55E' }]}>तस्वीर अपलोड करें</Text>
            </TouchableOpacity>
          </View>
        </View>
        {selectedImage && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Selected Image / चुनी गई तस्वीर</Text>
            <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingSection}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.analyzingText}>
                  Analyzing with AI... / AI से विश्लेषण हो रहा है...
                </Text>
              </View>
            )}
          </View>
        )}
        {analysisResult && !isAnalyzing && (
            <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Analysis Results / विश्लेषण परिणाम</Text>
                <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                    <AlertTriangle size={24} color="#EF4444" />
                    <View style={styles.resultHeaderText}>
                    <Text style={styles.resultDisease}>{analysisResult.disease}</Text>
                    <Text style={styles.resultDiseaseHindi}>{analysisResult.diseaseHindi}</Text>
                    </View>
                    <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{analysisResult.confidence}%</Text>
                    </View>
                </View>
                <View style={styles.treatmentSection}>
                    <Text style={styles.treatmentTitle}>
                        <CheckCircle size={16} color="#22C55E" /> Treatment / उपचार
                    </Text>
                    <Text style={styles.treatmentText}>{analysisResult.treatment.english}</Text>
                    <Text style={styles.treatmentTextHindi}>{analysisResult.treatment.hindi}</Text>
                </View>
                <View style={styles.preventionSection}>
                    <Text style={styles.preventionTitle}>
                        <Info size={16} color="#3B82F6" /> Prevention / बचाव
                    </Text>
                    <Text style={styles.preventionText}>{analysisResult.prevention.english}</Text>
                    <Text style={styles.preventionTextHindi}>{analysisResult.prevention.hindi}</Text>
                </View>
                </View>
            </View>
        )}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Photography Tips / फोटो लेने के सुझाव</Text>
          <View style={styles.tipsCard}>
            <Text style={styles.tipsText}>
              📸 Take clear, close-up photos of affected plant parts{'\n'}
              📸 प्रभावित पौधे के हिस्सों की स्पष्ट, करीबी तस्वीरें लें{'\n\n'}
              ☀️ Use natural lighting for best results{'\n'}
              ☀️ बेहतर परिणामों के लिए प्राकृतिक प्रकाश का उपयोग करें{'\n\n'}
              🌿 Include both healthy and affected areas{'\n'}
              🌿 स्वस्थ और प्रभावित दोनों क्षेत्रों को शामिल करें
            </Text>
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
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: '#6B7280',
    },
    uploadSection: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 16,
    },
    uploadOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    uploadButton: {
      flex: 1,
      backgroundColor: '#22C55E',
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    uploadButtonSecondary: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#22C55E',
    },
    uploadButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
      marginTop: 8,
    },
    uploadButtonTextHindi: {
      color: '#FFFFFF',
      fontSize: 14,
      marginTop: 4,
    },
    imageSection: {
      padding: 20,
    },
    selectedImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    analyzingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#EBF8FF',
      borderRadius: 12,
    },
    analyzingText: {
      marginLeft: 12,
      fontSize: 16,
      color: '#3B82F6',
      fontWeight: '600',
    },
    resultsSection: {
      padding: 20,
    },
    resultCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    resultHeaderText: {
      flex: 1,
      marginLeft: 12,
    },
    resultDisease: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
    },
    resultDiseaseHindi: {
      fontSize: 16,
      color: '#6B7280',
      marginTop: 2,
    },
    confidenceBadge: {
      backgroundColor: '#FEE2E2',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    confidenceText: {
      color: '#DC2626',
      fontWeight: '600',
      fontSize: 14,
    },
    severityIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    severityLabel: {
      fontSize: 16,
      color: '#6B7280',
      marginRight: 12,
    },
    severityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    severityText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    treatmentSection: {
      marginBottom: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    treatmentTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#22C55E',
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    treatmentText: {
      fontSize: 16,
      color: '#1F2937',
      lineHeight: 24,
      marginBottom: 4,
    },
    treatmentTextHindi: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
    },
    preventionSection: {
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    preventionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#3B82F6',
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    preventionText: {
      fontSize: 16,
      color: '#1F2937',
      lineHeight: 24,
      marginBottom: 4,
    },
    preventionTextHindi: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
    },
    tipsSection: {
      padding: 20,
    },
    tipsCard: {
      backgroundColor: '#F0FDF4',
      padding: 20,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#22C55E',
    },
    tipsText: {
      fontSize: 16,
      color: '#166534',
      lineHeight: 24,
    },
});