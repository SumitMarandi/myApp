import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../theme/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = theme.borderRadius.sm,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#F0F0F0'],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

export const PostSkeleton: React.FC = () => (
  <View style={styles.postContainer}>
    {/* Header */}
    <View style={styles.postHeader}>
      <Skeleton width={40} height={40} borderRadius={theme.borderRadius.full} />
      <View style={styles.headerText}>
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
      </View>
    </View>

    {/* Image */}
    <Skeleton width="100%" height={250} borderRadius={theme.borderRadius.lg} style={{ marginVertical: theme.spacing.md }} />

    {/* Actions */}
    <View style={styles.actions}>
      <Skeleton width={24} height={24} borderRadius={theme.borderRadius.sm} />
      <Skeleton width={24} height={24} borderRadius={theme.borderRadius.sm} style={{ marginLeft: theme.spacing.md }} />
      <Skeleton width={24} height={24} borderRadius={theme.borderRadius.sm} style={{ marginLeft: theme.spacing.md }} />
    </View>

    {/* Caption */}
    <Skeleton width="90%" height={14} style={{ marginTop: theme.spacing.sm }} />
    <Skeleton width="60%" height={14} style={{ marginTop: 4 }} />
  </View>
);

export const ChatSkeleton: React.FC = () => (
  <View style={styles.chatContainer}>
    <Skeleton width={50} height={50} borderRadius={theme.borderRadius.full} />
    <View style={styles.chatText}>
      <View style={styles.chatHeader}>
        <Skeleton width={100} height={16} />
        <Skeleton width={60} height={12} />
      </View>
      <Skeleton width="70%" height={14} style={{ marginTop: 4 }} />
    </View>
  </View>
);

export const StorySkeleton: React.FC = () => (
  <View style={styles.storyContainer}>
    <Skeleton width={70} height={70} borderRadius={theme.borderRadius.full} />
    <Skeleton width={60} height={12} style={{ marginTop: 4, alignSelf: 'center' }} />
  </View>
);

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  chatText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
});

export default Skeleton;