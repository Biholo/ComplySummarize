import { motion } from 'framer-motion';
import {
    Eye,
    EyeOff,
    Lock,
    Save,
    Upload,
    User
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    
    const [profileData, setProfileData] = useState({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@company.com',
    });

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Sécurité', icon: Lock },
    ];

    const handleProfileUpdate = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const getFullName = () => `${profileData.firstName} ${profileData.lastName}`;
    const getInitials = () => `${profileData.firstName[0]}${profileData.lastName[0]}`;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Profil & Paramètres
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Gérez votre profil et personnalisez votre expérience
                        </p>
                    </div>
                    
                    <Button variant="primary" className="w-full lg:w-auto">
                        <Save className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Sauvegarder les modifications</span>
                        <span className="sm:hidden">Sauvegarder</span>
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Navigation Tabs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="p-4">
                            {/* Mobile: Horizontal tabs */}
                            <nav className="flex lg:flex-col lg:space-y-2 space-x-2 lg:space-x-0 overflow-x-auto lg:overflow-visible">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 whitespace-nowrap lg:w-full ${
                                                activeTab === tab.id
                                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5 flex-shrink-0" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <Card className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                                        <div className="relative self-center sm:self-auto">
                                            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                                                {getInitials()}
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
                                                <Upload className="h-4 w-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{getFullName()}</h2>
                                            <p className="text-gray-600 mt-1">{profileData.email}</p>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                                <Badge variant="success">Compte vérifié</Badge>
                                                <Badge variant="info">Premium</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.firstName}
                                                onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="Votre prénom"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.lastName}
                                                onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <Card className="p-6 sm:p-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                        Changer le mot de passe
                                    </h3>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mot de passe actuel
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-12"
                                                    placeholder="Entrez votre mot de passe actuel"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="Entrez un nouveau mot de passe"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="Confirmez le nouveau mot de passe"
                                            />
                                        </div>
                                        
                                        <Button variant="primary" className="w-full sm:w-auto">
                                            Mettre à jour le mot de passe
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
