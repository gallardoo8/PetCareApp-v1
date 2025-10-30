import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('🔥 Configurando listener de autenticación...');
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log('👤 Estado de usuario cambió:', user ? user.email : 'No hay usuario');
            setUser(user);
            
            if (user) {
                await loadUserProfile(user.uid);
                await loadUserPets(user.uid);
            } else {
                setUserProfile(null);
                setUserPets([]);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    // Cargar perfil del usuario
    const loadUserProfile = async (uid) => {
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                setUserProfile(userDoc.data());
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    // Cargar mascotas del usuario (solo activas)
    const loadUserPets = async (uid) => {
        try {
            const petsSnapshot = await db.collection('mascotas')
                .where('userId', '==', uid)
                .get();
            
            const pets = petsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(pet => pet.isActive !== false);
            
            setUserPets(pets);
            console.log('🐾 Mascotas cargadas:', pets.length);
        } catch (error) {
            console.error('Error loading user pets:', error);
        }
    };

    // Función de registro
    const register = async (email, password, displayName) => {
        try {
            console.log('🔐 Intentando registrar usuario...');
            
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.updateProfile({ displayName: displayName });

            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                nombre: displayName,
                correo: email,
                fechaRegistro: new Date(),
                activo: true
            });

            console.log('✅ Usuario registrado exitosamente:', user.email);
            return { user, isNewUser: true };
        } catch (error) {
            console.error('❌ Error en registro:', error);
            throw error;
        }
    };

    // Función de login
    const login = async (email, password) => {
        try {
            console.log('🔐 Intentando login...');
            
            const result = await auth.signInWithEmailAndPassword(email, password);
            console.log('✅ Login exitoso:', result.user.email);
            return { user: result.user, isNewUser: false };
        } catch (error) {
            console.error('❌ Error en login:', error);
            throw error;
        }
    };

    // Función para agregar mascota
    const addPet = async (petData) => {
        try {
            console.log('🐾 Iniciando registro de mascota...');
            console.log('👤 Usuario actual:', user?.email, user?.uid);
            
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }
            
            const currentUser = auth.currentUser;
            console.log('🔐 Usuario en Firebase Auth:', currentUser?.email, currentUser?.uid);
            
            if (!currentUser) {
                throw new Error('Usuario no autenticado en Firebase');
            }
            
            const petDoc = {
                ...petData,
                userId: user.uid,
                isActive: true,
                fechaRegistro: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            console.log('📝 Datos de mascota a guardar:', petDoc);
            console.log('💾 Guardando en colección: mascotas');
            
            const docRef = await db.collection('mascotas').add(petDoc);
            
            console.log('✅ Mascota registrada con ID:', docRef.id);
            
            await loadUserPets(user.uid);
            
            return docRef;
        } catch (error) {
            console.error('❌ Error adding pet:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUserProfile(null);
            setUserPets([]);
            console.log('Logout exitoso');
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    };

    // ✅ NUEVAS FUNCIONES - AGREGADAS DENTRO DEL COMPONENTE

    // Actualizar perfil de usuario
    const updateUserProfile = async (updates) => {
        try {
            console.log('🔄 Actualizando perfil de usuario...');
            
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            const currentUser = auth.currentUser;
            
            // Actualizar en Firebase Auth si hay cambios en displayName
            if (updates.nombre && updates.nombre !== user.displayName) {
                await currentUser.updateProfile({
                    displayName: updates.nombre
                });
            }

            // Actualizar en Firestore
            const updateData = {
                ...updates,
                updatedAt: new Date()
            };

            await db.collection('users').doc(user.uid).update(updateData);

            // Recargar perfil
            await loadUserProfile(user.uid);
            
            console.log('✅ Perfil actualizado exitosamente');
            return { success: true };
        } catch (error) {
            console.error('❌ Error actualizando perfil:', error);
            throw error;
        }
    };

    // Actualizar email
    const updateUserEmail = async (newEmail, currentPassword) => {
        try {
            console.log('📧 Actualizando email...');
            
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            const currentUser = auth.currentUser;
            
            // Re-autenticar antes de cambiar email
            const credential = auth.EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            
            await currentUser.reauthenticateWithCredential(credential);
            
            // Actualizar email en Firebase Auth
            await currentUser.updateEmail(newEmail);
            
            // Actualizar en Firestore
            await db.collection('users').doc(user.uid).update({
                correo: newEmail,
                updatedAt: new Date()
            });

            // Recargar perfil
            await loadUserProfile(user.uid);
            
            console.log('✅ Email actualizado exitosamente');
            return { success: true };
        } catch (error) {
            console.error('❌ Error actualizando email:', error);
            throw error;
        }
    };

    // Cambiar contraseña
    const changePassword = async (currentPassword, newPassword) => {
        try {
            console.log('🔐 Cambiando contraseña...');
            
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            const currentUser = auth.currentUser;
            
            // Re-autenticar con la contraseña actual
            const credential = auth.EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            
            await currentUser.reauthenticateWithCredential(credential);
            
            // Actualizar contraseña
            await currentUser.updatePassword(newPassword);
            
            console.log('✅ Contraseña actualizada exitosamente');
            return { success: true };
        } catch (error) {
            console.error('❌ Error cambiando contraseña:', error);
            throw error;
        }
    };

    // Actualizar preferencias de notificaciones
    const updateNotificationPreferences = async (preferences) => {
        try {
            console.log('🔔 Actualizando preferencias de notificaciones...');
            
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            await db.collection('users').doc(user.uid).update({
                notifications: preferences,
                updatedAt: new Date()
            });

            // Recargar perfil
            await loadUserProfile(user.uid);
            
            console.log('✅ Preferencias de notificaciones actualizadas');
            return { success: true };
        } catch (error) {
            console.error('❌ Error actualizando notificaciones:', error);
            throw error;
        }
    };

    // Subir foto de perfil a Firebase Storage
   // Subir foto de perfil usando Cloudinary (igual que las mascotas)
const uploadProfilePhoto = async (imageUri) => {
    try {
        console.log('📸 Subiendo foto de perfil...');
        
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }

        // Importar el servicio de Cloudinary
        const { imageUploadService } = require('../services/imageUploadService');

        console.log('📤 Subiendo a Cloudinary...');

        // Subir imagen a Cloudinary en carpeta 'profile_photos'
        const uploadResult = await imageUploadService.uploadImage(
            imageUri,
            'profile_photos' // Carpeta en Cloudinary
        );

        if (!uploadResult.success) {
            throw new Error('No se pudo subir la imagen');
        }

        const downloadURL = uploadResult.url;
        console.log('✅ Imagen subida a Cloudinary:', downloadURL);

        // Actualizar en Firebase Auth
        await auth.currentUser.updateProfile({
            photoURL: downloadURL
        });

        // Actualizar en Firestore
        await db.collection('users').doc(user.uid).update({
            photoURL: downloadURL,
            imagePublicId: uploadResult.publicId, // Guardar para poder eliminarlo después
            updatedAt: new Date()
        });

        // Recargar perfil
        await loadUserProfile(user.uid);

        console.log('✅ Foto de perfil actualizada exitosamente');
        return { success: true, photoURL: downloadURL };
    } catch (error) {
        console.error('❌ Error subiendo foto:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        throw error;
    }
};

    // ✅ OBJETO VALUE - EXPORTA TODAS LAS FUNCIONES
    const value = {
        user,
        userProfile,
        userPets,
        register,
        login,
        logout,
        addPet,
        loadUserPets,
        updateUserProfile,
        updateUserEmail,
        changePassword,
        updateNotificationPreferences,
        uploadProfilePhoto,
        loadUserProfile,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};