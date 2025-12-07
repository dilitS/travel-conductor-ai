import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useToastStore, ToastType } from '@/stores/toastStore';
import { colors } from '@/theme/colors';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: colors.semantic.success + '20',
        borderColor: colors.semantic.success,
        icon: <CheckCircle size={20} color={colors.semantic.success} />,
      };
    case 'error':
      return {
        backgroundColor: colors.status.error + '20',
        borderColor: colors.status.error,
        icon: <XCircle size={20} color={colors.status.error} />,
      };
    case 'warning':
      return {
        backgroundColor: colors.status.warning + '20',
        borderColor: colors.status.warning,
        icon: <AlertTriangle size={20} color={colors.status.warning} />,
      };
    case 'info':
    default:
      return {
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.default,
        icon: <Info size={20} color={colors.text.secondary} />,
      };
  }
};

export function ToastContainer() {
  const { toasts, hideToast } = useToastStore();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {toasts.map((toast) => {
        const toastStyle = getToastStyles(toast.type);
        
        return (
          <Animated.View
            key={toast.id}
            entering={FadeInUp.duration(200)}
            exiting={FadeOutUp.duration(200)}
            style={[
              styles.toast,
              {
                backgroundColor: toastStyle.backgroundColor,
                borderColor: toastStyle.borderColor,
              },
            ]}
          >
            <View style={styles.iconContainer}>{toastStyle.icon}</View>
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
            <Pressable
              onPress={() => hideToast(toast.id)}
              style={styles.closeButton}
              hitSlop={8}
            >
              <X size={16} color={colors.text.muted} />
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

