import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20493b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  pulseCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 75,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
});
