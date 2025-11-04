import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#262626',
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#f8f9fa',
    },
    petImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#262626',
        backgroundColor: '#f8f9fa',
    },
    inputError: {
        borderColor: '#FF6B6B',
    },
    errorText: {
        fontSize: 12,
        color: '#FF6B6B',
        marginTop: 4,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        gap: 8,
    },
    genderButtonActive: {
        backgroundColor: '#4ECDC4',
        borderColor: '#4ECDC4',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    genderTextActive: {
        color: '#fff',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    dateText: {
        fontSize: 16,
        color: '#262626',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        gap: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
    },
});