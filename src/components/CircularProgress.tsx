import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({ percentage, size = 110, strokeWidth = 8 }: CircularProgressProps) {
  const { theme } = useTheme();
  
  const safePercentage = isNaN(percentage) ? 0 : Math.min(Math.max(percentage, 0), 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="rgba(0,0,0,0.3)" // Dark background track inside the purple card
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          // @ts-ignore
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={theme.success} // Green progress
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          // @ts-ignore
          strokeWidth={strokeWidth}
          // @ts-ignore
          strokeDasharray={`${circumference} ${circumference}`}
          // @ts-ignore
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.heroText, fontSize: 28, fontWeight: 'bold' }}>
          {safePercentage}%
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600', marginTop: 2 }}>
          OVERALL
        </Text>
      </View>
    </View>
  );
}