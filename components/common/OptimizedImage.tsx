import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';

export interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  placeholder?: { uri: string } | number;
  blurRadius?: number;
  fadeInDuration?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  priority?: 'low' | 'normal' | 'high';
  cachePolicy?: 'memory' | 'disk' | 'none';
  onLoad?: () => void;
  onError?: (error: any) => void;
  showLoader?: boolean;
  loaderColor?: string;
  fallbackComponent?: React.ReactNode;
}

interface ImageCache {
  [key: string]: {
    timestamp: number;
    data: string;
  };
}

class ImageCacheManager {
  private static instance: ImageCacheManager;
  private cache: ImageCache = {};
  private maxCacheSize = 50; // Maximum number of cached images
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  get(uri: string): string | null {
    const cached = this.cache[uri];
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      delete this.cache[uri];
      return null;
    }

    return cached.data;
  }

  set(uri: string, data: string): void {
    // Clean up old entries if cache is full
    if (Object.keys(this.cache).length >= this.maxCacheSize) {
      this.cleanup();
    }

    this.cache[uri] = {
      timestamp: Date.now(),
      data,
    };
  }

  private cleanup(): void {
    const entries = Object.entries(this.cache);
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 25% of entries
    const toRemove = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      delete this.cache[entries[i][0]];
    }
  }

  clear(): void {
    this.cache = {};
  }
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  containerStyle,
  placeholder,
  blurRadius = 5,
  fadeInDuration = 300,
  resizeMode = 'cover',
  priority = 'normal',
  cachePolicy = 'memory',
  onLoad,
  onError,
  showLoader = true,
  loaderColor = '#3b82f6',
  fallbackComponent,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(blurRadius)).current;
  const cacheManager = ImageCacheManager.getInstance();

  const imageUri = typeof source === 'object' ? source.uri : '';
  const placeholderUri =
    typeof placeholder === 'object' ? placeholder?.uri : '';

  useEffect(() => {
    if (imageUri) {
      // Get image dimensions for optimization
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageDimensions({ width, height });
        },
        (error) => {
          console.warn('Failed to get image dimensions:', error);
        },
      );
    }
  }, [imageUri]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);

    // Animate fade in and blur out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }),
      Animated.timing(blurAnim, {
        toValue: 0,
        duration: fadeInDuration,
        useNativeDriver: false, // Blur doesn't support native driver
      }),
    ]).start();

    onLoad?.();
  };

  const handleImageError = (error: any) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(error);
  };

  const getOptimizedUri = (uri: string): string => {
    if (!uri || typeof source === 'number') return uri;

    // Check cache first
    const cached = cacheManager.get(uri);
    if (cached && cachePolicy === 'memory') {
      return cached;
    }

    // Apply image optimizations based on dimensions and priority
    let optimizedUri = uri;

    // Add quality and format parameters if the URI supports them
    if (uri.includes('cloudinary.com') || uri.includes('imagekit.io')) {
      const separator = uri.includes('?') ? '&' : '?';
      const quality =
        priority === 'high' ? 85 : priority === 'normal' ? 75 : 65;
      optimizedUri = `${uri}${separator}q_${quality}&f_auto`;

      // Add dimensions if available
      if (imageDimensions && style) {
        const styleWidth = (style as any).width;
        const styleHeight = (style as any).height;
        if (styleWidth && styleHeight) {
          optimizedUri += `&w_${Math.ceil(styleWidth)}&h_${Math.ceil(styleHeight)}&c_fill`;
        }
      }
    }

    // Cache the optimized URI
    if (cachePolicy === 'memory') {
      cacheManager.set(uri, optimizedUri);
    }

    return optimizedUri;
  };

  const optimizedUri = getOptimizedUri(imageUri);

  if (hasError && fallbackComponent) {
    return (
      <View style={[styles.container, containerStyle]}>
        {fallbackComponent}
      </View>
    );
  }

  if (hasError) {
    return (
      <View
        style={[styles.container, styles.errorContainer, containerStyle, style]}
      >
        <Text style={styles.errorText}>Failed to load image</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Placeholder/Blur Background */}
      {(placeholder || isLoading) && (
        <View style={[styles.placeholderContainer, style]}>
          {placeholder && (
            <Image
              source={placeholder}
              style={[styles.placeholder, style]}
              resizeMode={resizeMode}
              blurRadius={blurRadius}
            />
          )}
          {!placeholder && (
            <BlurView intensity={50} style={[styles.placeholder, style]} />
          )}
        </View>
      )}

      {/* Loading Indicator */}
      {isLoading && showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={loaderColor} />
        </View>
      )}

      {/* Main Image */}
      {typeof source === 'number' ? (
        <Animated.Image
          source={source}
          style={[
            styles.image,
            style,
            {
              opacity: fadeAnim,
            },
          ]}
          resizeMode={resizeMode}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <Animated.Image
          source={{ uri: optimizedUri }}
          style={[
            styles.image,
            style,
            {
              opacity: fadeAnim,
            },
          ]}
          resizeMode={resizeMode}
          onLoad={handleImageLoad}
          onError={handleImageError}
          // Progressive loading for better UX
          progressiveRenderingEnabled={true}
          // Prefetch for high priority images
          {...(priority === 'high' && { priority: 'high' })}
        />
      )}
    </View>
  );
};

// Preload images for better performance
export const preloadImages = async (uris: string[]): Promise<void> => {
  const promises = uris.map((uri) => {
    return new Promise<void>((resolve, reject) => {
      Image.prefetch(uri)
        .then(() => resolve())
        .catch(() => resolve()); // Don't fail the entire batch if one image fails
    });
  });

  await Promise.all(promises);
};

// Clear image cache
export const clearImageCache = (): void => {
  ImageCacheManager.getInstance().clear();
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholder: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
