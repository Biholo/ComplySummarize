import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileText,
    Lightbulb,
    Share2,
    Tag,
    Target,
    User
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

// Mock data pour démonstration
const mockDocument = {
    id: '1',
    name: 'Contrat_Commercial_2024.pdf',
    uploadDate: '2024-01-15',
    status: 'completed',
    size: '2.4 MB',
    summary: 'Ce contrat commercial établit les termes et conditions pour la fourniture de services de consulting en technologie. Il inclut des clauses de confidentialité strictes, des conditions de paiement échelonnées sur 12 mois, et des dispositions spécifiques concernant la propriété intellectuelle. Le document définit également les responsabilités de chaque partie, les modalités de résiliation anticipée, et les procédures de résolution de conflits. Une attention particulière est portée aux aspects de compliance réglementaire et aux exigences de reporting mensuel.',
    keyPoints: [
        'Clause de confidentialité valable 5 ans après la fin du contrat',
        'Paiement échelonné sur 12 mois avec possibilité de report en cas de force majeure',
        'Transfert de propriété intellectuelle limité aux développements spécifiques',
        'Obligation de compliance avec les réglementations RGPD et sectorielles',
        'Clause de résiliation anticipée avec préavis de 30 jours minimum'
    ],
    actionSuggestions: [
        {
            action: 'Vérifier la conformité des clauses RGPD avec le DPO',
            priority: 'high',
            category: 'Legal'
        },
        {
            action: 'Valider les conditions de paiement avec le service comptabilité',
            priority: 'medium',
            category: 'Finance'
        },
        {
            action: 'Organiser une revue avec l\'équipe technique pour la PI',
            priority: 'medium',
            category: 'Technique'
        },
        {
            action: 'Planifier les points de reporting mensuel',
            priority: 'low',
            category: 'Suivi'
        }
    ],
    metadata: {
        author: 'Service Juridique',
        category: 'Contrat Commercial',
        pages: 24,
        language: 'Français'
    }
};

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
    const { id } = useParams();
    const document = mockDocument; // Dans un vrai projet, on ferait un fetch avec l'id

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/dashboard" className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Retour au dashboard</span>
                                <span className="sm:hidden">Retour</span>
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Share2 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Partager</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Download className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Télécharger</span>
                        </Button>
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
                                        {document.name}
                                    </h1>
                                    <Badge variant="success" className="self-start">Analysé</Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">
                                            Uploadé le {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                                        </span>
                                    </span>
                                    <span className="flex items-center">
                                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{document.metadata.author}</span>
                                    </span>
                                    <span className="flex items-center">
                                        <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{document.metadata.category}</span>
                                    </span>
                                    <span className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{document.metadata.pages} pages</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Summary */}
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

                {/* Key Points */}
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
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-start space-x-3 p-3 sm:p-4 bg-emerald-50 rounded-xl"
                                >
                                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-emerald-800 font-medium text-sm sm:text-base">{point}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Action Suggestions */}
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
                            {document.actionSuggestions.map((suggestion, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                                            {getPriorityIcon(suggestion.priority)}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                    {suggestion.action}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {suggestion.category}
                                                    </Badge>
                                                    {getPriorityBadge(suggestion.priority)}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                            <span className="hidden sm:inline">Marquer comme fait</span>
                                            <span className="sm:hidden">Fait</span>
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
} 