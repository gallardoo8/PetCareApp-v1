import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // Header con gradiente
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: Platform.OS === 'ios' ? 50 : 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },

    content: {
        flex: 1,
    },

    // Selector de imagen elegante
    imageSelector: {
        width: '100%',
        height: height * 0.35,
        backgroundColor: '#fff',
        marginBottom: 20,
        overflow: 'hidden',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'flex-end',
        padding: 20,
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(78, 205, 196, 0.95)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        alignSelf: 'flex-start',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    changePhotoText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    cameraIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f9f8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#4ECDC4',
        borderStyle: 'dashed',
    },
    imagePlaceholderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#262626',
        marginBottom: 8,
    },
    imagePlaceholderSubtitle: {
        fontSize: 14,
        color: '#8e8e8e',
        textAlign: 'center',
    },

    // Formulario
    form: {
        padding: 20,
        paddingBottom: 100,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    messageContainer: {
        alignItems: 'flex-start',
    },
    inputIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f9f8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    messageIconContainer: {
        marginTop: 4,
    },
    inputWrapper: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8e8e8e',
        marginBottom: 6,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    input: {
        fontSize: 16,
        color: '#262626',
        padding: 0,
    },
    messageInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // Botón de publicar
    publishButton: {
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    publishButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    publishButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    publishButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
});