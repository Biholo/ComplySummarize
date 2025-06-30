import { useUploadDocument } from '@/api/queries/documentQueries';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, FileText, Upload as UploadIcon, X } from 'lucide-react';
import React, { useState } from 'react';


import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

interface UploadFile {
    file: File;
    id: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
}

const Upload = () => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    
    // Utilisation des hooks React Query
    const uploadDocumentMutation = useUploadDocument();
    const queryClient = useQueryClient();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const uploadFiles: UploadFile[] = newFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            progress: 0,
        }));
        setFiles(prev => [...prev, ...uploadFiles]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const uploadFile = async (uploadFileItem: UploadFile) => {
        // Mise à jour du statut en "uploading"
        setFiles(prev => prev.map(f => 
            f.id === uploadFileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
        ));

        try {
            // Simulation de progression (React Query ne fournit pas de progress par défaut)
            const progressInterval = setInterval(() => {
                setFiles(prev => prev.map(f => {
                    if (f.id === uploadFileItem.id && f.progress < 90) {
                        return { ...f, progress: f.progress + 10 };
                    }
                    return f;
                }));
            }, 100);

            // Upload via React Query (le service attend juste un File)
            const result = await uploadDocumentMutation.mutateAsync(uploadFileItem.file);
            
            // Nettoyage de l'interval
            clearInterval(progressInterval);
            
            // Mise à jour du statut en "success"
            setFiles(prev => prev.map(f => 
                f.id === uploadFileItem.id 
                    ? { ...f, status: 'success', progress: 100 }
                    : f
            ));
            
            // Invalidation du cache des documents pour rafraîchir la liste
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            
            // Mise à jour du statut en "error"
            setFiles(prev => prev.map(f => 
                f.id === uploadFileItem.id 
                    ? { ...f, status: 'error', progress: 100 }
                    : f
            ));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <FileText className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">En attente</Badge>;
            case 'uploading':
                return <Badge variant="processing">Upload...</Badge>;
            case 'success':
                return <Badge variant="success">Terminé</Badge>;
            case 'error':
                return <Badge variant="error">Erreur</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Upload de documents
                    </h1>
                    <p className="text-gray-600">
                        Téléversez vos documents PDF pour générer des synthèses automatiques
                    </p>
                </motion.div>

                {/* Zone de drop */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card 
                        className={`p-8 sm:p-12 text-center transition-all duration-200 ${
                            isDragOver 
                                ? 'border-emerald-500 bg-emerald-50 border-2 border-dashed' 
                                : 'border-2 border-dashed border-gray-300 hover:border-emerald-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <UploadIcon className={`mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 sm:mb-6 ${
                            isDragOver ? 'text-emerald-500' : 'text-gray-400'
                        }`} />
                        
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            Glissez vos fichiers ici
                        </h3>
                        <p className="text-gray-500 mb-4 sm:mb-6">
                            ou cliquez pour sélectionner vos documents
                        </p>
                        
                        <div className="space-y-4">
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button variant="primary" size="lg" asChild className="w-full sm:w-auto">
                                    <span className="cursor-pointer">
                                        <span className="hidden sm:inline">Choisir des fichiers</span>
                                        <span className="sm:hidden">Choisir fichiers</span>
                                    </span>
                                </Button>
                            </label>
                            
                            <p className="text-xs text-gray-500">
                                Formats supportés : PDF uniquement (max. 10MB par fichier)
                            </p>
                        </div>
                    </Card>
                </motion.div>

                {/* Liste des fichiers */}
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Fichiers sélectionnés ({files.length})
                                </h2>
                            </div>
                            
                            <div className="divide-y divide-gray-200">
                                {files.map((fileItem, index) => (
                                    <motion.div
                                        key={fileItem.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 sm:p-6"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                                {getStatusIcon(fileItem.status)}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {fileItem.file.name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            {(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB
                                                        </span>
                                                        {getStatusBadge(fileItem.status)}
                                                    </div>
                                                    
                                                    {fileItem.status === 'uploading' && (
                                                        <div className="mt-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${fileItem.progress}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-500 mt-1">
                                                                {fileItem.progress}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                                {fileItem.status === 'pending' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => uploadFile(fileItem)}
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <span className="hidden sm:inline">Uploader</span>
                                                        <span className="sm:hidden">Upload</span>
                                                    </Button>
                                                )}
                                                
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(fileItem.id)}
                                                    className="flex-shrink-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {files.some(f => f.status === 'pending') && (
                                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        onClick={() => {
                                            files
                                                .filter(f => f.status === 'pending')
                                                .forEach(uploadFile);
                                        }}
                                    >
                                        <span className="hidden sm:inline">Uploader tous les fichiers</span>
                                        <span className="sm:hidden">Uploader tout</span>
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Upload; 