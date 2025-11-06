import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    // ✨ Header mejorado con gradiente
    headerContainer: {
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 20,
        paddingBottom: 20,
        backgroundColor: '#4ECDC4',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerIconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: 2,
        fontWeight: '500',
    },
    addButton: {
        padding: 4,
    },
    addButtonInner: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    content: {
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? 110 : 90, // ✅ Espacio para navbar
    },

    // 📅 Calendario mejorado
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        marginTop: 24,
        borderRadius: 20,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
            },
            android: {
                elevation: 6,
            },
        }),
    },

    // 🎯 Sección de eventos del día
    eventsSection: {
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 24,
    },
    eventsSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
        paddingHorizontal: 4,
    },

    // 🎴 Cards de eventos mejoradas
    eventCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderLeftWidth: 4,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    eventCardCompleted: {
        opacity: 0.6,
        backgroundColor: '#F8F9FA',
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    eventIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    eventTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#95A5A6',
    },
    eventTime: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 4,
        fontWeight: '500',
    },
    eventPet: {
        fontSize: 13,
        color: '#4ECDC4',
        fontWeight: '600',
        marginTop: 2,
    },
    eventActions: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 8,
    },
    checkButton: {
        padding: 4,
    },
    deleteButton: {
        padding: 4,
    },
    eventDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        lineHeight: 20,
    },

    // 📋 Estado vacío mejorado
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    emptyStateText: {
        fontSize: 16,
        color: '#7F8C8D',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    emptyStateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    emptyStateButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    // 📅 Próximos eventos
    upcomingSection: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
    upcomingSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    upcomingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    upcomingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    upcomingInfo: {
        flex: 1,
    },
    upcomingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    upcomingDate: {
        fontSize: 13,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    upcomingPet: {
        fontSize: 12,
        color: '#4ECDC4',
        fontWeight: '600',
        marginTop: 2,
    },

    // 🎭 Modal mejorado
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '85%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2C3E50',
        letterSpacing: 0.3,
    },
    modalCloseButton: {
        padding: 4,
    },

    // 📝 Formulario del modal
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
    },
    textArea: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // 🎨 Botones de tipo
    typeButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        gap: 6,
    },
    typeButtonActive: {
        borderColor: 'transparent',
    },
    typeButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    typeButtonTextActive: {
        color: '#FFFFFF',
    },

    // 🐾 Botones de mascotas
    petButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    petButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        gap: 6,
    },
    petButtonActive: {
        backgroundColor: '#4ECDC4',
        borderColor: '#4ECDC4',
    },
    petButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    petButtonTextActive: {
        color: '#FFFFFF',
    },
    noPetsText: {
        fontSize: 14,
        color: '#95A5A6',
        fontStyle: 'italic',
    },

    // 📅 Botón de fecha
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dateButtonText: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
    },

    // 🔔 Toggle de notificación
    notificationToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: '#E8EBED',
    },
    notificationToggleActive: {
        backgroundColor: '#E8F9F7',
        borderColor: '#4ECDC4',
    },
    notificationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    notificationTextActive: {
        color: '#2C3E50',
    },
    toggleSwitch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E0E0E0',
        padding: 3,
        justifyContent: 'center',
    },
    toggleSwitchActive: {
        backgroundColor: '#4ECDC4',
    },
    toggleCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    toggleCircleActive: {
        transform: [{ translateX: 22 }],
    },

    // 🎯 Botones del modal
    modalButtonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7F8C8D',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});