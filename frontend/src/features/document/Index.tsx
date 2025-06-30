import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, Grid, List, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

// Données de demo pour la liste des documents
const mockDocuments = [
    {
        id: '1',
        name: 'Contrat_Commercial_2024.pdf',
        uploadDate: '2024-01-15',
        status: 'completed',
        category: 'Contrat',
        summary: 'Contrat commercial avec clauses de confidentialité et conditions de paiement détaillées.',
        size: '2.4 MB',
    },
    {
        id: '2',
        name: 'Rapport_Conformite.pdf',
        uploadDate: '2024-01-14',
        status: 'processing',
        category: 'Rapport',
        summary: null,
        size: '1.8 MB',
    },
    {
        id: '3',
        name: 'Norme_ISO_27001.pdf',
        uploadDate: '2024-01-12',
        status: 'completed',
        category: 'Norme',
        summary: 'Guide de mise en conformité ISO 27001 pour la sécurité de l\'information.',
        size: '5.2 MB',
    },
    {
        id: '4',
        name: 'Politique_RGPD.pdf',
        uploadDate: '2024-01-10',
        status: 'completed',
        category: 'Politique',
        summary: 'Politique de protection des données personnelles conforme au RGPD.',
        size: '1.2 MB',
    },
    {
        id: '5',
        name: 'Manuel_Procedures.pdf',
        uploadDate: '2024-01-08',
        status: 'error',
        category: 'Manuel',
        summary: null,
        size: '3.7 MB',
    },
    {
        id: '6',
        name: 'Audit_Interne_2024.pdf',
        uploadDate: '2024-01-05',
        status: 'completed',
        category: 'Audit',
        summary: 'Rapport d\'audit interne avec recommandations pour l\'amélioration continue.',
        size: '2.1 MB',
    },
];

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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredDocuments = mockDocuments.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...Array.from(new Set(mockDocuments.map(doc => doc.category)))];

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
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'Toutes les catégories' : category}
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
                    </Card>
                </motion.div>

                {/* Documents */}
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
                                            {getStatusBadge(document.status)}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                                                {document.name}
                                            </h3>
                                            
                                            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                                                <span className="mx-2">•</span>
                                                <span>{document.size}</span>
                                            </div>
                                            
                                            <div className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-medium ring-1 ring-inset mb-4 ${getCategoryColor(document.category)}`}>
                                                {document.category}
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
                                                            {document.name}
                                                        </h3>
                                                        {getStatusBadge(document.status)}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                                                        </span>
                                                        <span>{document.size}</span>
                                                        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryColor(document.category)}`}>
                                                            {document.category}
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

                {/* Empty State */}
                {filteredDocuments.length === 0 && (
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