import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#20493bff',
    },
    innerContainer: {
        flex: 1,
        backgroundColor: '#20493bff',
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },

    contentContainer: {
        paddingTop: 40,
    },

    currentTimeCard: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    currentTimeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    currentTimeLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    currentTimeName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    currentTime: {
        fontSize: 28,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    currentTimeContent: {
        gap: 10,
    },
    currentTimeSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },

    // Settings Panel
    settingsPanel: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    settingsPanelContent: {
        padding: 20,
    },
    settingsPanelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 20,
    },
    settingItem: {
        marginBottom: 20,
    },
    settingItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    settingItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    settingButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    settingButtonText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    calculationMethods: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    methodChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    methodChipActive: {
        backgroundColor: '#2E7D32',
        borderColor: '#2E7D32',
    },
    methodChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    methodChipTextActive: {
        color: '#FFFFFF',
    },
    // Loading & Error States
    loadingContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    errorContainer: {
        paddingVertical: 60,
        paddingHorizontal: 40,
        alignItems: 'center',
        gap: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#FFCDD2',
        textAlign: 'center',
        lineHeight: 24,
    },
    retryButton: {
        marginTop: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    retryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Bottom Padding
    bottomPadding: {
        height: 100,
    },
})