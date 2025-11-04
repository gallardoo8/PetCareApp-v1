import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Image, 
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    Modal,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { petArchiveService } from '../services/petServices';
import { communityService } from '../services/communityService';
import styles from '../styles/HuellitasScreenStyles';
import CreateMemoryModal from './CreateMemoryModal';
import { notificationService } from '../services/notificationService';


export default function HuellitasEternasScreen({ navigation }) {
    const { user, userProfile } = useAuth();
    const [archivedPets, setArchivedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [communityPosts, setCommunityPosts] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [shareMessage, setShareMessage] = useState('');
    const [sharing, setSharing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState({});
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [addingComment, setAddingComment] = useState(false);
    
    
    // ✅ NUEVO: Estados para respuestas
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMemoryImage, setNewMemoryImage] = useState(null);
    const [newMemoryPetName, setNewMemoryPetName] = useState('');
    const [newMemorySpecies, setNewMemorySpecies] = useState('');
    const [newMemoryMessage, setNewMemoryMessage] = useState('');
    const [creatingMemory, setCreatingMemory] = useState(false);

    const [unreadCount, setUnreadCount] = useState(0);

    // ✅ Referencias para scroll
    const scrollViewRef = useRef(null);
    const commentInputRef = useRef(null);

    useEffect(() => {
        requestPermissions();
        loadData();
        initializeNotifications();
        loadUnreadCount();
    }, []);

    // ✅ NUEVO: Listener para el teclado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                // Scroll al final cuando aparece el teclado
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const requestPermissions = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        } catch (error) {
            console.error('Error solicitando permisos:', error);
        }
    };


     // ✅ NUEVO: Inicializar notificaciones
    const initializeNotifications = async () => {
        try {
            const hasPermission = await notificationService.requestPermissions();
            if (hasPermission) {
                await notificationService.saveUserPushToken(user.uid);
            }
        } catch (error) {
            console.error('Error inicializando notificaciones:', error);
        }
    };

    // ✅ NUEVO: Cargar contador de notificaciones no leídas
    const loadUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount(user.uid);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error cargando contador:', error);
        }
    };

    // ✅ NUEVO: Ir a pantalla de notificaciones
    const handleOpenNotifications = () => {
        navigation.navigate('UserNotifications'); // Crearemos esta pantalla
    };

    const handleCreateMemory = () => {
        setShowCreateModal(true);
        setNewMemoryImage(null);
        setNewMemoryPetName('');
        setNewMemorySpecies('');
        setNewMemoryMessage('');
    };
// ✅ FUNCIÓN CORREGIDA: Abrir selector de imagen
const handleSelectImageForNewMemory = () => {
    console.log('🎯 handleSelectImageForNewMemory llamada');
    Alert.alert(
        'Agregar Foto',
        'Selecciona una opción',
        [
            { 
                text: 'Cámara', 
                onPress: () => {
                    console.log('📸 Opción cámara seleccionada');
                    takePhotoForNewMemory();
                }
            },
            { 
                text: 'Galería', 
                onPress: () => {
                    console.log('🖼️ Opción galería seleccionada');
                    pickImageForNewMemory();
                }
            },
            { 
                text: 'Cancelar', 
                style: 'cancel',
                onPress: () => console.log('❌ Selección cancelada')
            }
        ]
    );
};

// ✅ FUNCIÓN CORREGIDA: Tomar foto
const takePhotoForNewMemory = async () => {
    try {
        console.log('📸 Iniciando cámara...');
        
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        console.log('📦 Resultado de cámara:', result);

        if (!result.canceled && result.assets && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            console.log('✅ Imagen capturada:', imageUri);
            console.log('📊 Detalles:', {
                width: result.assets[0].width,
                height: result.assets[0].height,
                type: result.assets[0].type
            });
            
            // ✅ CRÍTICO: Actualizar el estado
            setNewMemoryImage(imageUri);
            console.log('✅ Estado actualizado con imagen');
            
            Alert.alert('Éxito', 'Foto capturada correctamente');
            return imageUri;
        } else {
            console.log('⚠️ Captura cancelada o sin assets');
            Alert.alert('Aviso', 'No se capturó ninguna foto');
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error tomando foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
        return null;
    }
};

// ✅ FUNCIÓN CORREGIDA: Seleccionar de galería
const pickImageForNewMemory = async () => {
    try {
        console.log('🖼️ Abriendo galería...');
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        console.log('📦 Resultado de galería:', result);

        if (!result.canceled && result.assets && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            console.log('✅ Imagen seleccionada:', imageUri);
            console.log('📊 Detalles:', {
                width: result.assets[0].width,
                height: result.assets[0].height,
                type: result.assets[0].type
            });
            
            // ✅ CRÍTICO: Actualizar el estado
            setNewMemoryImage(imageUri);
            console.log('✅ Estado actualizado con imagen');
            
            Alert.alert('Éxito', 'Imagen seleccionada correctamente');
            return imageUri;
        } else {
            console.log('⚠️ Selección cancelada o sin assets');
            Alert.alert('Aviso', 'No se seleccionó ninguna imagen');
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error seleccionando imagen:', error);
        Alert.alert('Error', 'No se pudo seleccionar la imagen: ' + error.message);
        return null;
    }
};

// ✅ FUNCIÓN CORREGIDA: Publicar recuerdo
const handlePublishNewMemory = async () => {
    try {
        console.log('🚀 Iniciando publicación...');
        console.log('📝 Nombre:', newMemoryPetName);
        console.log('🐾 Especie:', newMemorySpecies);
        console.log('💬 Mensaje:', newMemoryMessage);
        console.log('📸 Imagen:', newMemoryImage);
        
        // ✅ VALIDACIONES
        if (!newMemoryImage) {
            Alert.alert('Error', 'Debes agregar una foto');
            return;
        }
        
        if (!newMemoryPetName || newMemoryPetName.trim() === '') {
            Alert.alert('Error', 'Ingresa el nombre de tu mascota');
            return;
        }

        setCreatingMemory(true);

        // ✅ Construir objeto limpio
        const petData = {
            nombre: newMemoryPetName.trim(),
            especie: newMemorySpecies.trim() || 'Mascota',
            raza: ''
        };

        console.log('📦 Datos a enviar:', petData);
        console.log('💬 Mensaje:', newMemoryMessage.trim());
        console.log('📸 URI:', newMemoryImage);

        await communityService.shareMemorialDirect(
            petData,
            newMemoryMessage.trim(),
            newMemoryImage
        );

        console.log('✅ Recuerdo compartido exitosamente');
        
        // Cerrar modal y limpiar
        setShowCreateModal(false);
        setNewMemoryImage(null);
        setNewMemoryPetName('');
        setNewMemorySpecies('');
        setNewMemoryMessage('');
        
        // Recargar posts
        await loadCommunityPosts();

        Alert.alert('Publicado', 'Tu recuerdo ha sido compartido con la comunidad');
    } catch (error) {
        console.error('❌ Error publicando recuerdo:', error);
        Alert.alert('Error', 'No se pudo publicar: ' + error.message);
    } finally {
        setCreatingMemory(false);
    }
};


    const handleAddPhoto = async (pet) => {
        Alert.alert(
            'Agregar Foto',
            'Elige una opción',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Tomar Foto', onPress: () => takePhoto(pet) },
                { text: 'Elegir de Galería', onPress: () => pickImageFromGallery(pet) },
            ]
        );
    };

    const takePhoto = async (pet) => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadPetImage(pet.id, result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error tomando foto:', error);
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    };

    const pickImageFromGallery = async (pet) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadPetImage(pet.id, result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error eligiendo imagen:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const uploadPetImage = async (petId, imageUri) => {
        try {
            setUploadingImage(prev => ({ ...prev, [petId]: true }));
            await petArchiveService.uploadArchivedPetImage(petId, imageUri);
            Alert.alert('Éxito', 'Foto actualizada correctamente');
            await loadArchivedPets();
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            Alert.alert('Error', 'No se pudo actualizar la foto');
        } finally {
            setUploadingImage(prev => ({ ...prev, [petId]: false }));
        }
    };

    const loadData = async () => {
        await loadArchivedPets();
        await loadCommunityPosts();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const loadArchivedPets = async () => {
        try {
            setLoading(true);
            const pets = await petArchiveService.getArchivedPets(user.uid);
            setArchivedPets(pets);
        } catch (error) {
            console.error('Error cargando mascotas archivadas:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCommunityPosts = async () => {
        try {
            const posts = await communityService.getCommunityPosts(50);
            setCommunityPosts(posts);
        } catch (error) {
            console.error('Error cargando posts comunitarios:', error);
            setCommunityPosts([]);
        }
    };

    const handleShareToCommunity = (pet) => {
        if (!pet.imageUrl) {
            Alert.alert(
                'Foto requerida',
                'Para compartir en la comunidad, necesitas agregar una foto de tu mascota.',
                [
                    { text: 'Agregar Foto', onPress: () => handleAddPhoto(pet) },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );
            return;
        }

        setSelectedPet(pet);
        setShowShareModal(true);
    };

    const confirmShare = async () => {
        if (!selectedPet) return;

        try {
            setSharing(true);
            await communityService.shareMemorial(selectedPet, shareMessage, true);
            
            setShowShareModal(false);
            setShareMessage('');
            setSelectedPet(null);
            
            Alert.alert(
                'Compartido', 
                'El recuerdo de tu mascota ha sido compartido',
                [
                    {
                        text: 'Ver en Comunidad',
                        onPress: async () => {
                            setActiveTab('community');
                            await loadCommunityPosts();
                        }
                    },
                    { text: 'OK' }
                ]
            );
        } catch (error) {
            console.error('Error compartiendo:', error);
            Alert.alert('Error', 'No se pudo compartir el recuerdo');
        } finally {
            setSharing(false);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            await communityService.likePost(postId, user.uid);
            
            setCommunityPosts(prevPosts => 
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const hasLiked = post.likedBy?.includes(user.uid);
                        const newLikedBy = hasLiked 
                            ? post.likedBy.filter(id => id !== user.uid)
                            : [...(post.likedBy || []), user.uid];
                        
                        return {
                            ...post,
                            likes: hasLiked ? post.likes - 1 : post.likes + 1,
                            likedBy: newLikedBy
                        };
                    }
                    return post;
                })
            );
        } catch (error) {
            console.error('Error dando like:', error);
        }
    };

    // ✅ NUEVO: Dar like a comentario
    const handleLikeComment = async (commentId) => {
        try {
            await communityService.likeComment(selectedPost.id, commentId, user.uid);
            
            // Actualizar UI local
            setSelectedPost(prev => ({
                ...prev,
                comments: prev.comments.map(comment => {
                    if (comment.id === commentId) {
                        const hasLiked = comment.likedBy?.includes(user.uid);
                        const newLikedBy = hasLiked 
                            ? comment.likedBy.filter(id => id !== user.uid)
                            : [...(comment.likedBy || []), user.uid];
                        
                        return {
                            ...comment,
                            likes: hasLiked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
                            likedBy: newLikedBy
                        };
                    }
                    return comment;
                })
            }));
        } catch (error) {
            console.error('Error dando like a comentario:', error);
        }
    };

    const handleOpenComments = (post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
        setReplyingTo(null);
        setCommentText('');
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            setAddingComment(true);
            const result = await communityService.addComment(
                selectedPost.id,
                user.uid,
                userProfile?.nombre || user.displayName || 'Usuario',
                commentText.trim()
            );

            setCommunityPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === selectedPost.id) {
                        return {
                            ...post,
                            comments: [...(post.comments || []), result.comment]
                        };
                    }
                    return post;
                })
            );

            setSelectedPost(prev => ({
                ...prev,
                comments: [...(prev.comments || []), result.comment]
            }));

            setCommentText('');
            Keyboard.dismiss();
        } catch (error) {
            console.error('Error agregando comentario:', error);
            Alert.alert('Error', 'No se pudo agregar el comentario');
        } finally {
            setAddingComment(false);
        }
    };

    // ✅ NUEVO: Responder a comentario
    const handleReplyToComment = (comment) => {
        setReplyingTo(comment);
        setReplyText('');
        commentInputRef.current?.focus();
    };

    // ✅ NUEVO: Enviar respuesta
    const handleSendReply = async () => {
        if (!replyText.trim() || !replyingTo) return;

        try {
            setAddingComment(true);
            await communityService.replyToComment(
                selectedPost.id,
                replyingTo.id,
                user.uid,
                userProfile?.nombre || user.displayName || 'Usuario',
                replyText.trim()
            );

            // Recargar post
            const posts = await communityService.getCommunityPosts(50);
            const updatedPost = posts.find(p => p.id === selectedPost.id);
            setSelectedPost(updatedPost);
            setCommunityPosts(posts);

            setReplyingTo(null);
            setReplyText('');
            Keyboard.dismiss();
        } catch (error) {
            console.error('Error respondiendo comentario:', error);
            Alert.alert('Error', 'No se pudo responder');
        } finally {
            setAddingComment(false);
        }
    };

    const handlePostOptions = (post) => {
        const isOwnPost = post.userId === user.uid;

        const buttons = isOwnPost
            ? [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => handleDeletePost(post)
                }
            ]
            : [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Reportar', 
                    onPress: () => Alert.alert('Reportar', 'Función en desarrollo')
                }
            ];

        Alert.alert('Opciones', 'Selecciona una opción', buttons);
    };

    const handleDeletePost = (post) => {
        Alert.alert(
            'Eliminar Post',
            `¿Eliminar el recuerdo de ${post.petName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await communityService.deletePost(post.id, user.uid);
                            setCommunityPosts(prevPosts => 
                                prevPosts.filter(p => p.id !== post.id)
                            );
                            Alert.alert('Eliminado', 'El post ha sido eliminado');
                        } catch (error) {
                            console.error('Error eliminando:', error);
                            Alert.alert('Error', 'No se pudo eliminar el post');
                        }
                    }
                }
            ]
        );
    };

    const handleRestorePet = (pet) => {
        Alert.alert(
            'Restaurar Mascota',
            `¿Restaurar a ${pet.nombre}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restaurar',
                    onPress: async () => {
                        try {
                            await petArchiveService.restorePet(pet.id);
                            await loadArchivedPets();
                            Alert.alert('Éxito', `${pet.nombre} ha sido restaurada`);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo restaurar');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (date) => {
        if (!date) return 'Fecha desconocida';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatRelativeTime = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins} min`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return formatDate(date);
    };

    const ArchivedPetCard = ({ pet }) => {
        const isUploading = uploadingImage[pet.id];

        return (
            <View style={styles.instagramCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.petAvatarContainer}>
                        {pet.imageUrl ? (
                            <Image source={{ uri: pet.imageUrl }} style={styles.petAvatar} />
                        ) : (
                            <View style={styles.petAvatarPlaceholder}>
                                <Ionicons name="paw" size={20} color="#fff" />
                            </View>
                        )}
                    </View>
                    <View style={styles.petHeaderInfo}>
                        <Text style={styles.petCardName}>{pet.nombre}</Text>
                        <Text style={styles.petCardDetails}>{pet.especie} • {pet.raza}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAddPhoto(pet)}>
                        <Ionicons name="camera-outline" size={24} color="#262626" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.cardImageContainer}
                    onPress={() => handleAddPhoto(pet)}
                    activeOpacity={0.95}
                >
                    {pet.imageUrl ? (
                        <Image 
                            source={{ uri: pet.imageUrl }} 
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.cardImagePlaceholder}>
                            <Ionicons name="camera" size={60} color="#c7c7cc" />
                            <Text style={styles.placeholderText}>Agregar Foto</Text>
                        </View>
                    )}
                    {isUploading && (
                        <View style={styles.uploadingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleShareToCommunity(pet)}
                        disabled={!pet.imageUrl}
                    >
                        <Ionicons 
                            name="share-social-outline" 
                            size={26} 
                            color={pet.imageUrl ? "#262626" : "#c7c7cc"} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleRestorePet(pet)}
                    >
                        <Ionicons name="arrow-undo-outline" size={26} color="#262626" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.memorialDate}>
                        {formatDate(pet.archivedDate)}
                    </Text>
                    {pet.farewellMessage && (
                        <Text style={styles.farewellMessage} numberOfLines={2}>
                            {pet.farewellMessage}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const CommunityPostCard = ({ post }) => {
        const hasLiked = post.likedBy?.includes(user.uid);
        
        return (
            <View style={styles.instagramPost}>
                <View style={styles.postHeader}>
                    <View style={styles.postUserInfo}>
                        <View style={styles.postAvatar}>
                            <Ionicons name="person" size={20} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.postUserName}>{post.userName}</Text>
                            <Text style={styles.postLocation}>Huellitas Eternas</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handlePostOptions(post)}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#262626" />
                    </TouchableOpacity>
                </View>

                {post.imageUrl && (
                    <Image 
                        source={{ uri: post.imageUrl }} 
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.postActionsRow}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleLikePost(post.id)}
                        >
                            <Ionicons 
                                name={hasLiked ? "heart" : "heart-outline"} 
                                size={28} 
                                color={hasLiked ? "#ed4956" : "#262626"} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleOpenComments(post)}
                        >
                            <Ionicons name="chatbubble-outline" size={26} color="#262626" />
                        </TouchableOpacity>
                    </View>
                </View>

                {post.likes > 0 && (
                    <Text style={styles.likesText}>
                        {post.likes} {post.likes === 1 ? 'me gusta' : 'me gusta'}
                    </Text>
                )}

                <View style={styles.captionContainer}>
                    <Text style={styles.captionText}>
                        <Text style={styles.captionUserName}>{post.userName} </Text>
                        En memoria de <Text style={styles.petNameBold}>{post.petName}</Text>
                        {post.petSpecies && <Text style={styles.petBreed}> • {post.petSpecies}</Text>}
                        {post.message && `\n${post.message}`}
                    </Text>
                </View>

                {post.comments && post.comments.length > 0 && (
                    <TouchableOpacity 
                        style={styles.viewCommentsButton}
                        onPress={() => handleOpenComments(post)}
                    >
                        <Text style={styles.viewCommentsText}>
                            Ver {post.comments.length === 1 ? 'el comentario' : `los ${post.comments.length} comentarios`}
                        </Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.postTime}>{formatRelativeTime(post.createdAt)}</Text>
            </View>
        );
    };

    if (loading && archivedPets.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.instagramHeader}>
                <Text style={styles.instagramHeaderTitle}>Huellitas Eternas</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity 
                        style={styles.headerIconButton}
                        onPress={handleOpenNotifications}
                    >
                        <Ionicons name="notifications-outline" size={26} color="#262626" />
                        {unreadCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'personal' && styles.activeTabButton]}
                    onPress={() => setActiveTab('personal')}
                >
                    <Ionicons 
                        name="heart" 
                        size={22} 
                        color={activeTab === 'personal' ? '#262626' : '#8e8e8e'} 
                    />
                    <Text style={[styles.tabButtonText, activeTab === 'personal' && styles.activeTabButtonText]}>
                        Mis Recuerdos
                    </Text>
                    {activeTab === 'personal' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'community' && styles.activeTabButton]}
                    onPress={() => setActiveTab('community')}
                >
                    <Ionicons 
                        name="people" 
                        size={22} 
                        color={activeTab === 'community' ? '#262626' : '#8e8e8e'} 
                    />
                    <Text style={[styles.tabButtonText, activeTab === 'community' && styles.activeTabButtonText]}>
                        Comunidad
                    </Text>
                    {activeTab === 'community' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {activeTab === 'personal' ? (
                    <>
                        {archivedPets.length > 0 ? (
                            archivedPets.map(pet => (
                                <ArchivedPetCard key={pet.id} pet={pet} />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="heart-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.emptyStateTitle}>
                                    Aún no hay recuerdos
                                </Text>
                                <Text style={styles.emptyStateText}>
            Los recuerdos de tus mascotas aparecerán aquí
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                    {communityPosts.length > 0 ? (
                            communityPosts.map(post => (
                                <CommunityPostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.emptyStateTitle}>
                                    Sin publicaciones
                                </Text>
                                <Text style={styles.emptyStateText}>
                                    {/* ✅ CAMBIO: Texto actualizado */}
                                    Comparte tu primer recuerdo presionando el botón +
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

{/* boton flotante  para crear recuerdo */}
            {activeTab === 'community' && (
                <TouchableOpacity 
                    style={styles.fab}
                    onPress={handleCreateMemory}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>
            )}

            {/* ✅ MEJORADO: Modal crear recuerdo con KeyboardAvoidingView */}
            <Modal
                visible={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setNewMemoryImage(null); 
                    setNewMemoryPetName('');
                    setNewMemorySpecies('');
                    setNewMemoryMessage('');
                }}
                onSelectImage={handleSelectImageForNewMemory}
                onPublish={handlePublishNewMemory}
                loading={creatingMemory}
                selectedImage={newMemoryImage} 
                petName={newMemoryPetName}
                setPetName={setNewMemoryPetName}
                species={newMemorySpecies}
                setSpecies={setNewMemorySpecies}
                message={newMemoryMessage}
                setMessage={setNewMemoryMessage}
                // ← NUEVO: Pasar la imagen
                            //animationType="slide"
                            //presentationStyle="pageSheet"
            >
                <KeyboardAvoidingView 
                    style={styles.createModalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
            <View style={styles.createModalHeader}>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                    <Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>
                {/* ✅ CAMBIO: Texto más claro */}
                <Text style={styles.createModalTitle}>Compartir en Comunidad</Text>
                <TouchableOpacity 
                    onPress={handlePublishNewMemory}
                    disabled={creatingMemory || !newMemoryImage || !newMemoryPetName}
                >
                    {creatingMemory ? (
                        <ActivityIndicator size="small" color="#0095f6" />
                    ) : (
                        <Text style={[
                            styles.publishButton,
                            (!newMemoryImage || !newMemoryPetName) && styles.publishButtonDisabled
                        ]}>
                            Compartir
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
                    <ScrollView 
                        style={styles.createModalContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TouchableOpacity 
                            style={styles.imageSelector}
                            onPress={handleSelectImageForNewMemory}
                        >
                            {newMemoryImage ? (
                                <Image 
                                    source={{ uri: newMemoryImage }} 
                                    style={styles.selectedImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.imageSelectorPlaceholder}>
                                    <Ionicons name="camera" size={60} color="#c7c7cc" />
                                    <Text style={styles.imageSelectorText}>Agregar Foto</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Nombre de tu mascota *"
                                value={newMemoryPetName}
                                onChangeText={setNewMemoryPetName}
                                placeholderTextColor="#8e8e8e"
                            />

                            <TextInput
                                style={styles.inputField}
                                placeholder="Especie (ej: Perro, Gato)"
                                value={newMemorySpecies}
                                onChangeText={setNewMemorySpecies}
                                placeholderTextColor="#8e8e8e"
                            />

                            <TextInput
                                style={[styles.inputField, styles.messageInput]}
                                placeholder="Comparte un recuerdo especial..."
                                value={newMemoryMessage}
                                onChangeText={setNewMemoryMessage}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                placeholderTextColor="#8e8e8e"
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            {/* ✅ MEJORADO: Modal comentarios con likes y respuestas */}
            <Modal
                visible={showCommentsModal}
                animationType="slide"
                transparent={false}
            >
                <KeyboardAvoidingView 
                    style={styles.commentsModalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <View style={styles.commentsHeader}>
                        <TouchableOpacity onPress={() => {
                            setShowCommentsModal(false);
                            setReplyingTo(null);
                        }}>
                            <Ionicons name="arrow-back" size={28} color="#262626" />
                        </TouchableOpacity>
                        <Text style={styles.commentsHeaderTitle}>Comentarios</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <ScrollView 
                        ref={scrollViewRef}
                        style={styles.commentsList}
                        keyboardShouldPersistTaps="handled"
                    >
                        {selectedPost?.comments?.length > 0 ? (
                            selectedPost.comments.map((comment) => (
                                <View key={comment.id}>
                                    <View style={styles.commentItem}>
                                        <View style={styles.commentAvatar}>
                                            <Ionicons name="person" size={16} color="#fff" />
                                        </View>
                                        <View style={styles.commentContent}>
                                            <Text style={styles.commentUserName}>{comment.userName}</Text>
                                            <Text style={styles.commentText}>{comment.text}</Text>
                                            
                                            {/* ✅ NUEVO: Acciones de comentario */}
                                            <View style={styles.commentActions}>
                                                <TouchableOpacity 
                                                    style={styles.commentAction}
                                                    onPress={() => handleLikeComment(comment.id)}
                                                >
                                                    <Ionicons 
                                                        name={comment.likedBy?.includes(user.uid) ? "heart" : "heart-outline"} 
                                                        size={14} 
                                                        color={comment.likedBy?.includes(user.uid) ? "#ed4956" : "#8e8e8e"} 
                                                    />
                                                    {comment.likes > 0 && (
                                                        <Text style={styles.commentLikesCount}>{comment.likes}</Text>
                                                    )}
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity 
                                                    style={styles.commentAction}
                                                    onPress={() => handleReplyToComment(comment)}
                                                >
                                                    <Text style={styles.replyButton}>Responder</Text>
                                                </TouchableOpacity>
                                                
                                                <Text style={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</Text>
                                            </View>

                                            {/* ✅ NUEVO: Respuestas */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <View style={styles.repliesContainer}>
                                                    {comment.replies.map((reply) => (
                                                        <View key={reply.id} style={styles.replyItem}>
                                                            <View style={styles.replyAvatar}>
                                                                <Ionicons name="person" size={12} color="#fff" />
                                                            </View>
                                                            <View style={styles.replyContent}>
                                                                <Text style={styles.replyUserName}>{reply.userName}</Text>
                                                                <Text style={styles.replyText}>{reply.text}</Text>
                                                                <Text style={styles.replyTime}>{formatRelativeTime(reply.createdAt)}</Text>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noComments}>
                                <Ionicons name="chatbubbles-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.noCommentsText}>Sin comentarios</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* ✅ MEJORADO: Input de comentario con indicador de respuesta */}
                    <View style={styles.commentInputArea}>
                        {replyingTo && (
                            <View style={styles.replyingToBar}>
                                <Text style={styles.replyingToText}>
                                    Respondiendo a {replyingTo.userName}
                                </Text>
                                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                    <Ionicons name="close" size={20} color="#262626" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.commentInputRow}>
                            <View style={styles.commentAvatar}>
                                <Ionicons name="person" size={16} color="#fff" />
                            </View>
                            <TextInput
                                ref={commentInputRef}
                                style={styles.commentInputField}
                                placeholder={replyingTo ? "Escribe tu respuesta..." : "Agrega un comentario..."}
                                value={replyingTo ? replyText : commentText}
                                onChangeText={replyingTo ? setReplyText : setCommentText}
                                placeholderTextColor="#8e8e8e"                                multiline
                            />
                            <TouchableOpacity 
                                onPress={replyingTo ? handleSendReply : handleAddComment}
                                disabled={addingComment || (replyingTo ? !replyText.trim() : !commentText.trim())}
                            >
                                <Text style={[
                                    styles.sendCommentButton,
                                    (addingComment || (replyingTo ? !replyText.trim() : !commentText.trim())) && styles.sendCommentButtonDisabled
                                ]}>
                                    {addingComment ? '...' : 'Publicar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* ✅ MEJORADO: Modal compartir con KeyboardAvoidingView */}
            <Modal
                visible={showShareModal}
                animationType="slide"
                transparent={true}
            >
                <KeyboardAvoidingView 
                    style={styles.shareModalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.shareModalContent}>
                        <View style={styles.shareModalHeader}>
                            <Text style={styles.shareModalTitle}>Compartir Recuerdo</Text>
                            <TouchableOpacity onPress={() => setShowShareModal(false)}>
                                <Ionicons name="close" size={28} color="#262626" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView keyboardShouldPersistTaps="handled">
                            {selectedPet && selectedPet.imageUrl && (
                                <Image 
                                    source={{ uri: selectedPet.imageUrl }} 
                                    style={styles.sharePreviewImage}
                                />
                            )}

                            <TextInput
                                style={styles.shareMessageInput}
                                placeholder="Escribe un mensaje..."
                                value={shareMessage}
                                onChangeText={setShareMessage}
                                multiline
                                placeholderTextColor="#8e8e8e"
                            />
                        </ScrollView>

                        <TouchableOpacity 
                            style={styles.shareConfirmButton}
                            onPress={confirmShare}
                            disabled={sharing}
                        >
                            {sharing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.shareConfirmButtonText}>Compartir</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}   