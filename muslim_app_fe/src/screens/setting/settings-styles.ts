import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20493bff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 10,
    color: '#FFFFFF',
  },
});
