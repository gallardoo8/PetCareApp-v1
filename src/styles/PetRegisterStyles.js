import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F8F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#2C3E50',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    speciesContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    speciesButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingVertical: 16,
        gap: 8,
        borderWidth: 2,
        borderColor: '#E9ECEF',
    },
    speciesButtonSelected: {
        backgroundColor: '#E8F8F5',
        borderColor: '#4ECDC4',
    },
    speciesText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    speciesTextSelected: {
        color: '#4ECDC4',
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    dateText: {
        fontSize: 16,
        color: '#2C3E50',
    },
    
    // ✅ Estilos para selector de género
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: '#E9ECEF',
    },
    genderButtonMaleActive: {
        backgroundColor: '#EBF5FB',
        borderColor: '#3498DB',
    },
    genderButtonFemaleActive: {
        backgroundColor: '#FADBD8',
        borderColor: '#E74C3C',
    },
    genderIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E9ECEF',
    },
    genderIconCircleMaleActive: {
        backgroundColor: '#3498DB',
        borderColor: '#3498DB',
    },
    genderIconCircleFemaleActive: {
        backgroundColor: '#E74C3C',
        borderColor: '#E74C3C',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7F8C8D',
        marginTop: 4,
    },
    genderTextActive: {
        color: '#2C3E50',
    },
    
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 32,
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
 // ✅ ACTUALIZADO: Estilos para selector de género (más pequeños)
genderContainer: {
    flexDirection: 'row',
    gap: 12,
},
genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14, // ← Reducido de 20 a 14
    paddingHorizontal: 12, // ← Reducido de 16 a 12
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 8, // ← Nuevo: espacio entre ícono y texto
},
genderButtonMaleActive: {
    backgroundColor: '#EBF5FB',
    borderColor: '#3498DB',
},
genderButtonFemaleActive: {
    backgroundColor: '#FADBD8',
    borderColor: '#E74C3C',
},
genderIconCircle: {
    width: 32, // ← Reducido de 56 a 32
    height: 32, // ← Reducido de 56 a 32
    borderRadius: 16, // ← Reducido de 28 a 16
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
},
genderIconCircleMaleActive: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
},
genderIconCircleFemaleActive: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
},
genderText: {
    fontSize: 15, // ← Reducido de 16 a 15
    fontWeight: '600',
    color: '#7F8C8D',
},
genderTextActive: {
    color: '#2C3E50',
},
});
