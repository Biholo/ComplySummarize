import { motion } from 'framer-motion';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Lightbulb,
    Loader2,
    RotateCcw,
    Tag,
    Target,
    User
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useGetDocumentById } from '@/api/queries/documentQueries';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { useAuthStore } from '@/stores/authStore';
import { DocumentCategory, DocumentStatus } from '@shared/enums/documentEnums';

const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'high':
            return <Badge variant="error">Haute</Badge>;
        case 'medium':
            return <Badge variant="pending">Moyenne</Badge>;
        case 'low':
            return <Badge variant="info">Basse</Badge>;
        default:
            return <Badge variant="secondary">Normale</Badge>;
    }
};

const getPriorityIcon = (priority: string) => {
    switch (priority) {
        case 'high':
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'medium':
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'low':
            return <CheckCircle className="h-4 w-4 text-blue-500" />;
        default:
            return <Target className="h-4 w-4 text-gray-500" />;
    }
};

export default function DocumentDetail() {
    const { id } = useParams<{ id: string }>();
    
    // Utilisation de la vraie query API
    const { data: documentResponse, isLoading, error, refetch } = useGetDocumentById(id || '', !!id);
    const { user } = useAuthStore();
    const document = documentResponse;

    // Helper pour mapper les statuts
    const mapStatus = (status: DocumentStatus) => {
        switch (status) {
            case DocumentStatus.COMPLETED:
                return { label: 'Analysé', variant: 'success' as const };
            case DocumentStatus.PROCESSING:
                return { label: 'En cours', variant: 'processing' as const };
            case DocumentStatus.ERROR:
                return { label: 'Erreur', variant: 'error' as const };
            case DocumentStatus.PENDING:
                return { label: 'En attente', variant: 'secondary' as const };
            default:
                return { label: 'Inconnu', variant: 'secondary' as const };
        }
    };

    // Helper pour formater le nom de catégorie
    const formatCategoryName = (category: DocumentCategory) => {
        switch (category) {
            case DocumentCategory.CONTRACT:
                return 'Contrat Commercial';
            case DocumentCategory.REPORT:
                return 'Rapport';
            case DocumentCategory.STANDARD:
                return 'Norme';
            case DocumentCategory.POLICY:
                return 'Politique';
            case DocumentCategory.MANUAL:
                return 'Manuel';
            case DocumentCategory.AUDIT:
                return 'Audit';
            default:
                return category;
        }
    };

    // Helper pour formater la taille
    const formatSize = (sizeInBytes?: number) => {
        if (!sizeInBytes) return 'N/A';
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return `${sizeInMB.toFixed(1)} MB`;
    };

    // Helper pour la priorité des actions (par défaut moyenne si pas spécifiée)
    const getActionPriority = (index: number) => {
        // Alternance des priorités pour la démo
        const priorities = ['high', 'medium', 'low'];
        return priorities[index % 3];
    };

    // Helper pour les catégories d'actions (par défaut basée sur le type)
    const getActionCategory = (index: number, documentCategory: DocumentCategory) => {
        const categories = ['Legal', 'Finance', 'Technique', 'Suivi'];
        return categories[index % 4];
    };

    // États de loading et d'erreur
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                    <Card className="p-8 sm:p-12 text-center">
                        <Loader2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6 animate-spin" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            Chargement du document...
                        </h3>
                        <p className="text-gray-500">
                            Veuillez patienter pendant que nous récupérons les détails
                        </p>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                    <Card className="p-8 sm:p-12 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4 sm:mb-6" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            Document non trouvé
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Le document demandé n'existe pas ou n'est plus disponible
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="outline" onClick={() => refetch()}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Réessayer
                            </Button>
                            <Button asChild>
                                <Link to="/dashboard">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Retour au dashboard
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const statusInfo = mapStatus(document.status);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                >
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/dashboard" className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Retour au dashboard</span>
                                <span className="sm:hidden">Retour</span>
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Détail du document
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Consultez l'analyse détaillée de votre document
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {document.url && (
                            <Button variant="outline" size="lg" asChild>
                                <a href={document.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Voir le document</span>
                                    <span className="sm:hidden">Voir</span>
                                </a>
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Document Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="p-4 bg-emerald-50 rounded-2xl self-start">
                                <FileText className="h-12 w-12 text-emerald-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                                        {document.originalName}
                                    </h1>
                                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">
                                                {
                                                    new Date(document.createdAt).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                }
                                        </span>
                                    </span>
                                    <span className="flex items-center">
                                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{user?.firstName} {user?.lastName}</span>
                                    </span>
                                    <span className="flex items-center">
                                        <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{formatCategoryName(document.category)}</span>
                                    </span>
                                    <span className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">
                                            {document.totalPages ? `${document.totalPages} pages` : formatSize(document.size)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Summary */}
                {document.summary && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-6 sm:p-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="p-2 bg-blue-50 rounded-lg mr-3 flex-shrink-0">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                Résumé automatique
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                    {document.summary}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Key Points */}
                {document.keyPoints && document.keyPoints.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-6 sm:p-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <div className="p-2 bg-emerald-50 rounded-lg mr-3 flex-shrink-0">
                                    <Target className="h-5 w-5 text-emerald-600" />
                                </div>
                                Points clés identifiés
                            </h2>
                            <div className="space-y-4">
                                {document.keyPoints.map((point, index) => (
                                    <motion.div
                                        key={point.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-start space-x-3 p-3 sm:p-4 bg-emerald-50 rounded-xl"
                                    >
                                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-emerald-800 font-medium text-sm sm:text-base">{point.title}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Action Suggestions */}
                {document.actionSuggestions && document.actionSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="p-6 sm:p-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <div className="p-2 bg-yellow-50 rounded-lg mr-3 flex-shrink-0">
                                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                                </div>
                                Suggestions d'actions
                            </h2>
                            <div className="space-y-4">
                                {document.actionSuggestions.map((suggestion, index) => {
                                    const priority = getActionPriority(index);
                                    const category = suggestion.label || getActionCategory(index, document.category);
                                    
                                    return (
                                        <motion.div
                                            key={suggestion.id || index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                                    {getPriorityIcon(priority)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                            {suggestion.title}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {category}
                                                            </Badge>
                                                            {getPriorityBadge(priority)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Empty state si pas de contenu analysé */}
                {document.status === DocumentStatus.COMPLETED && 
                 (!document.summary && (!document.keyPoints || document.keyPoints.length === 0) && 
                  (!document.actionSuggestions || document.actionSuggestions.length === 0)) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 sm:p-12 text-center">
                            <FileText className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                Analyse terminée
                            </h3>
                            <p className="text-gray-500">
                                Le document a été analysé mais aucun contenu spécifique n'a été extrait
                            </p>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
} 