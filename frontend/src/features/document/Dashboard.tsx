import { motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

// Données de demo
const mockDocuments = [
    {
        id: '1',
        name: 'Contrat_Commercial_2024.pdf',
        uploadDate: '2024-01-15',
        status: 'completed',
        size: '2.4 MB',
        summary: 'Contrat commercial avec clauses de confidentialité...',
    },
    {
        id: '2',
        name: 'Rapport_Conformite.pdf',
        uploadDate: '2024-01-14',
        status: 'processing',
        size: '1.8 MB',
        summary: null,
    },
    {
        id: '3',
        name: 'Norme_ISO_27001.pdf',
        uploadDate: '2024-01-12',
        status: 'error',
        size: '5.2 MB',
        summary: null,
    },
    {
        id: '4',
        name: 'Politique_RGPD.pdf',
        uploadDate: '2024-01-10',
        status: 'completed',
        size: '1.2 MB',
        summary: 'Politique de protection des données personnelles...',
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

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="h-5 w-5 text-emerald-500" />;
        case 'processing':
            return <Clock className="h-5 w-5 text-blue-500" />;
        case 'error':
            return <XCircle className="h-5 w-5 text-red-500" />;
        default:
            return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
};

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [documents] = useState(mockDocuments);

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const completedCount = documents.filter(doc => doc.status === 'completed').length;
    const processingCount = documents.filter(doc => doc.status === 'processing').length;
    const errorCount = documents.filter(doc => doc.status === 'error').length;

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
                            Tableau de bord
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Gérez vos documents et consultez les synthèses générées par l'IA
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="w-full lg:w-auto"
                        asChild
                    >
                        <Link to="/upload" className="flex items-center justify-center">
                            <Plus className="mr-2 h-5 w-5" />
                            <span className="hidden sm:inline">Uploader un document</span>
                            <span className="sm:hidden">Uploader</span>
                        </Link>
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                    <Card className="p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 bg-blue-50 rounded-xl">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total</h3>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{documents.length}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl">
                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Terminés</h3>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{completedCount}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 bg-blue-50 rounded-xl">
                                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500">En cours</h3>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{processingCount}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 bg-red-50 rounded-xl">
                                <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Erreurs</h3>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{errorCount}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un document..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Filtres</span>
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Documents List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Documents récents
                            </h2>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                            {filteredDocuments.map((document, index) => (
                                <motion.div
                                    key={document.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(document.status)}
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {document.name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                                                        <span className="text-xs text-gray-500 flex items-center">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {document.size}
                                                        </span>
                                                        {getStatusBadge(document.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 self-end sm:self-center">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/document/${document.id}`} className='flex items-center'>
                                                    <Eye className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Voir</span>
                                                </Link>
                                            </Button>
                                            
                                            {document.status === 'completed' && (
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}
                                            
                                            {document.status === 'error' && (
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            )}
                                            
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {document.summary && (
                                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                                            <p className="text-sm text-emerald-800">
                                                <strong>Synthèse :</strong> {document.summary}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
} 