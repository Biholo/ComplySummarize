import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, FileText, Grid, List, Loader2, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useGetAllDocuments } from '@/api/queries/documentQueries';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { DocumentCategory, DocumentStatus } from '@shared/enums/documentEnums';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return <Badge variant="success">Terminé</Badge>;
        case 'processing':
            return <Badge variant="processing">En cours</Badge>;
        case 'error':
            return <Badge variant="error">Erreur</Badge>;
        default:
            return <Badge variant="secondary">Inconnu</Badge>;
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Contrat':
            return 'bg-blue-50 text-blue-700 ring-blue-600/20';
        case 'Rapport':
            return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
        case 'Norme':
            return 'bg-purple-50 text-purple-700 ring-purple-600/20';
        case 'Politique':
            return 'bg-orange-50 text-orange-700 ring-orange-600/20';
        case 'Manuel':
            return 'bg-pink-50 text-pink-700 ring-pink-600/20';
        case 'Audit':
            return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
        default:
            return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
};

const Index = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Utilisation des vraies queries API
    const { data: documentsResponse, isLoading, error, refetch } = useGetAllDocuments({ 
        page: 1, 
        limit: 100,
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? (selectedCategory as DocumentCategory) : undefined
    });

    const documents = documentsResponse || [];

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Générer la liste des catégories depuis les vraies données
    const categories = ['all', ...Array.from(new Set(documents.map(doc => doc.category)))];

    // Helper pour mapper les statuts
    const mapStatus = (status: DocumentStatus) => {
        switch (status) {
            case DocumentStatus.COMPLETED:
                return 'completed';
            case DocumentStatus.PROCESSING:
                return 'processing';
            case DocumentStatus.ERROR:
                return 'error';
            case DocumentStatus.PENDING:
                return 'processing';
            default:
                return 'unknown';
        }
    };

    // Helper pour formater la taille
    const formatSize = (sizeInBytes?: number) => {
        if (!sizeInBytes) return 'N/A';
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return `${sizeInMB.toFixed(1)} MB`;
    };

    // Helper pour formater le nom de catégorie
    const formatCategoryName = (category: DocumentCategory) => {
        switch (category) {
            case DocumentCategory.CONTRACT:
                return 'Contrat';
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Tous mes documents
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Consultez et gérez tous vos documents analysés
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" asChild className="w-full sm:w-auto">
                            <Link to="/upload">
                                <span className="hidden sm:inline">Uploader</span>
                                <span className="sm:hidden">Upload</span>
                            </Link>
                        </Button>
                        <Button asChild className="w-full sm:w-auto">
                            <Link to="/dashboard">
                                <span className="hidden sm:inline">Tableau de bord</span>
                                <span className="sm:hidden">Dashboard</span>
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans vos documents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors w-full sm:w-auto"
                                    disabled={isLoading}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'Toutes les catégories' : formatCategoryName(category as DocumentCategory)}
                                        </option>
                                    ))}
                                </select>
                                
                                <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors ${
                                            viewMode === 'grid' 
                                                ? 'bg-white shadow-sm text-emerald-600' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Grid className="h-4 w-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors ${
                                            viewMode === 'list' 
                                                ? 'bg-white shadow-sm text-emerald-600' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <List className="h-4 w-4 mx-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Error state in filters */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                                <div className="flex items-center text-red-600">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Erreur lors du chargement des documents</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Réessayer
                                </Button>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 sm:p-12 text-center">
                            <Loader2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6 animate-spin" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                Chargement des documents...
                            </h3>
                            <p className="text-gray-500">
                                Veuillez patienter pendant que nous récupérons vos documents
                            </p>
                        </Card>
                    </motion.div>
                )}

                {/* Documents */}
                {!isLoading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {filteredDocuments.map((document, index) => (
                                    <motion.div
                                        key={document.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <Card hoverable className="p-4 sm:p-6 h-full flex flex-col">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl">
                                                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                                </div>
                                                {getStatusBadge(mapStatus(document.status))}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                                                    {document.originalName}
                                                </h3>
                                                
                                                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                    {/* Note: createdAt pas disponible dans DocumentDto */}
                                                    {new Date().toLocaleDateString('fr-FR')}
                                                    <span className="mx-2">•</span>
                                                    <span>{formatSize(document.size)}</span>
                                                </div>
                                                
                                                <div className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-medium ring-1 ring-inset mb-4 ${getCategoryColor(formatCategoryName(document.category))}`}>
                                                    {formatCategoryName(document.category)}
                                                </div>
                                                
                                                {document.summary && (
                                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-4">
                                                        {document.summary}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full group text-xs sm:text-sm"
                                                asChild
                                            >
                                                <Link to={`/document/${document.id}`} className='flex items-center'>
                                                    <span className="hidden sm:inline">Voir le détail</span>
                                                    <span className="sm:hidden">Voir</span>
                                                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="overflow-hidden">
                                <div className="divide-y divide-gray-200">
                                    {filteredDocuments.map((document, index) => (
                                        <motion.div
                                            key={document.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                                    <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                                                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                                                {document.originalName}
                                                            </h3>
                                                            {getStatusBadge(mapStatus(document.status))}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {new Date().toLocaleDateString('fr-FR')}
                                                            </span>
                                                            <span>{formatSize(document.size)}</span>
                                                            <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryColor(formatCategoryName(document.category))}`}>
                                                                {formatCategoryName(document.category)}
                                                            </div>
                                                        </div>
                                                        {document.summary && (
                                                            <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                                                                {document.summary}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                                                    <Link to={`/document/${document.id}`}>
                                                        <span className="hidden sm:inline">Voir</span>
                                                        <span className="sm:hidden">Voir</span>
                                                    </Link>
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredDocuments.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-8 sm:p-12 text-center">
                            <FileText className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                Aucun document trouvé
                            </h3>
                            <p className="text-gray-500 mb-4 sm:mb-6">
                                {searchTerm || selectedCategory !== 'all' 
                                    ? 'Essayez de modifier vos critères de recherche'
                                    : 'Uploadez votre premier document pour commencer l\'analyse'
                                }
                            </p>
                            <Button asChild className="w-full sm:w-auto">
                                <Link to="/upload">
                                    <span className="hidden sm:inline">Uploader un document</span>
                                    <span className="sm:hidden">Uploader</span>
                                </Link>
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Index; 