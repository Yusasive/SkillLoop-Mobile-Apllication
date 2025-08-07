import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  height = 8,
  borderRadius = 4,
}) => {
  const animatedWidth = useSharedValue(0);

  React.useEffect(() => {
    animatedWidth.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  const styles = createStyles(backgroundColor, color, height, borderRadius);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
};

const createStyles = (backgroundColor: string, color: string, height: number, borderRadius: number) =>
  StyleSheet.create({
    container: {
      height,
      backgroundColor,
      borderRadius,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: color,
      borderRadius,
    },
  });