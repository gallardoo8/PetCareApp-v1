
// ✅ Servicio para subir imágenes a Cloudinary
// Optimizado para React Native/Expo

const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'dy8jhgpph',
    UPLOAD_PRESET: 'pet_images_unsigned',
};

export const imageUploadService = {
    /**
     * Sube una imagen a Cloudinary
     * @param {string} imageUri - URI local de la imagen
     * @param {string} folder - Carpeta en Cloudinary (opcional)
     * @returns {Promise<{success: boolean, url: string, publicId: string}>}
     */
    uploadImage: async (imageUri, folder = 'pets') => {
        try {
            console.log('📤 Iniciando subida a Cloudinary...');
            console.log('📸 URI de imagen:', imageUri);

            if (!imageUri) {
                throw new Error('No se proporcionó una URI de imagen');
            }

            // ✅ CORRECCIÓN: Crear FormData correctamente para React Native
            const formData = new FormData();
            
            // Obtener el nombre del archivo desde la URI
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // ✅ Agregar la imagen con el formato correcto para React Native
            formData.append('file', {
                uri: imageUri,
                type: type,
                name: filename || `photo_${Date.now()}.jpg`,
            });

            // Agregar configuración de Cloudinary
            formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
            formData.append('folder', folder);
            formData.append('timestamp', Date.now().toString());

            // URL de la API de Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`;

            console.log('🌐 Subiendo a:', cloudinaryUrl);
            console.log('📁 Carpeta:', folder);

            // ✅ CORRECCIÓN: Headers simplificados para React Native
            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // NO incluir Content-Type manualmente, fetch lo maneja automáticamente
                },
            });

            console.log('📡 Respuesta status:', response.status);

            // Parsear respuesta
            const result = await response.json();

            console.log('📦 Respuesta recibida:', result);

            if (response.ok && result.secure_url) {
                console.log('✅ Imagen subida exitosamente');
                console.log('🔗 URL:', result.secure_url);

                return {
                    success: true,
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                };
            } else {
                console.error('❌ Error en respuesta:', result);
                throw new Error(
                    result.error?.message || 
                    'Error al subir la imagen a Cloudinary'
                );
            }
        } catch (error) {
            console.error('❌ Error subiendo imagen:', error);
            console.error('❌ Stack:', error.stack);
            
            if (error.message.includes('Network')) {
                throw new Error('Error de conexión. Verifica tu internet.');
            } else if (error.message.includes('fetch')) {
                throw new Error('No se pudo acceder al servicio de imágenes.');
            } else {
                throw error;
            }
        }
    },

    /**
     * Optimiza una URL de Cloudinary para diferentes tamaños
     */
    getOptimizedUrl: (url, width = 800, height = 800) => {
        if (!url || !url.includes('cloudinary.com')) {
            return url;
        }

        // Insertar transformaciones de tamaño
        return url.replace(
            '/upload/',
            `/upload/w_${width},h_${height},c_fill,q_auto/`
        );
    },

    /**
     * Obtiene versión thumbnail
     */
    getThumbnailUrl: (url) => {
        return imageUploadService.getOptimizedUrl(url, 200, 200);
    },
};