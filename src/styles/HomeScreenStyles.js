import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    
   // Header mejorado con gradiente
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
logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
},

logoIconWrapper: {
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
logoTextContainer: {
    flexDirection: 'column',
},
logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
},
logoSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.3,
    marginTop: 2,
},
addPetButton: {
    padding: 4,
},
addPetButtonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
},

    // Contenedor de mascotas con más padding
    petsContainer: {
        flex: 1,
    },
        petsContentContainer: {
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: Platform.OS === 'ios' ? 110 : 90, // ✅ Más espacio para el navbar
            alignItems: 'center',
        },

    // 🎨 Tarjeta de mascota minimalista y centrada
    petCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        width: width - 40, // Ancho controlado con margen
        maxWidth: 400, // Máximo para tablets
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    // Botón de opciones en la esquina
    archiveButtonTop: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
    },

    // Imagen grande y centrada
    petImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    petImageWrapper: {
        position: 'relative',
    },
    petImageStyle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#F8F9FA',
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E8A87C',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#F8F9FA',
    },

    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Información centrada
    petInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    petName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    petBreed: {
        fontSize: 15,
        color: '#7F8C8D',
        marginBottom: 4,
        fontWeight: '500',
    },
    petAge: {
        fontSize: 13,
        color: '#95A5A6',
        fontWeight: '400',
    },

    // Opciones con diseño minimalista
    optionsList: {
        gap: 12,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        minHeight: 56,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#E8F9F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '500',
        letterSpacing: 0.2,
    },

    // Estado vacío
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 15,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    emptyStateButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
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
        fontWeight: '600',
        fontSize: 16,
    },
     // Botón de opciones (editar/archivar)
    optionsButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
    },

    // 💝 Botón de Huellitas Eternas minimalista
    huellitasButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#FFE0E0',
        ...Platform.select({
            ios: {
                shadowColor: '#E74C3C',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    huellitasIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    huellitasTextContainer: {
        flex: 1,
    },
    huellitasTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#E74C3C',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    huellitasSubtitle: {
        fontSize: 13,
        color: '#95A5A6',
        lineHeight: 18,
    }
});

export default styles;