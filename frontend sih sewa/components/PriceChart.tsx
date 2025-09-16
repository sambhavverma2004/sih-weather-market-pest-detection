import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface PriceChartProps {
  data: Array<{ date: string; price: number }>;
}

export default function PriceChart({ data }: PriceChartProps) {
  const screenWidth = Dimensions.get('window').width - 40;
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice || 1;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>₹{maxPrice}</Text>
          <Text style={styles.axisLabel}>₹{Math.round((maxPrice + minPrice) / 2)}</Text>
          <Text style={styles.axisLabel}>₹{minPrice}</Text>
        </View>
        
        <View style={styles.plotArea}>
          {/* Grid lines */}
          <View style={styles.gridLine} />
          <View style={[styles.gridLine, { top: '50%' }]} />
          <View style={[styles.gridLine, { bottom: 0 }]} />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * (screenWidth - 80);
            const y = ((maxPrice - point.price) / priceRange) * 120;
            
            return (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  {
                    left: x,
                    top: y,
                  }
                ]}
              />
            );
          })}
          
          {/* Connect points with lines */}
          {data.map((point, index) => {
            if (index === 0) return null;
            
            const x1 = ((index - 1) / (data.length - 1)) * (screenWidth - 80);
            const y1 = ((maxPrice - data[index - 1].price) / priceRange) * 120;
            const x2 = (index / (data.length - 1)) * (screenWidth - 80);
            const y2 = ((maxPrice - point.price) / priceRange) * 120;
            
            const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            
            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.line,
                  {
                    left: x1,
                    top: y1,
                    width: width,
                    transform: [{ rotate: `${angle}deg` }],
                  }
                ]}
              />
            );
          })}
        </View>
      </View>
      
      <View style={styles.xAxis}>
        {data.map((point, index) => (
          <Text key={index} style={styles.xAxisLabel}>
            {point.date}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 140,
  },
  yAxis: {
    width: 60,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  axisLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  plotArea: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
    top: 0,
  },
  dataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#22C55E',
    transformOrigin: '0 50%',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingLeft: 60,
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});