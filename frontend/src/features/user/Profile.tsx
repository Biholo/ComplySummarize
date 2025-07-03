import { motion } from 'framer-motion';
import {
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Save,
    Upload,
    User,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useUpdatePassword } from '@/api/queries/authQueries';
import { useUpdateUser } from '@/api/queries/userQueries';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '@shared/enums';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useAuthStore();
    
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const updateUserMutation = useUpdateUser();
    const updatePasswordMutation = useUpdatePassword();

    // Initialiser les données du profil avec les données du store
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
        }
    }, [user]);

    // Fonction pour afficher un message de succès
    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    // Fonction pour afficher un message d'erreur
    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Sécurité', icon: Lock },
    ];

    const handleProfileUpdate = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordUpdate = (field: string, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        if (!user?.id) return;

        try {
            await updateUserMutation.mutateAsync({
                userId: user.id,
                user: {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    email: profileData.email,
                    password: 'dummy' // Requis par le DTO mais non utilisé
                }
            });
            showSuccessMessage('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            showErrorMessage('Erreur lors de la mise à jour du profil');
        }
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showErrorMessage('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            await updatePasswordMutation.mutateAsync({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });
            
            // Réinitialiser les champs
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            
            showSuccessMessage('Mot de passe mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            showErrorMessage('Erreur lors de la mise à jour du mot de passe');
        }
    };

    const getFullName = () => `${profileData.firstName} ${profileData.lastName}`;
    const getInitials = () => `${profileData.firstName[0] || ''}${profileData.lastName[0] || ''}`;

    const isProfileSaving = updateUserMutation.isPending;
    const isPasswordSaving = updatePasswordMutation.isPending;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Messages de notification */}
            {(successMessage || errorMessage) && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
                        successMessage 
                            ? 'bg-green-50 border border-green-200 text-green-800' 
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        {successMessage && <CheckCircle className="h-5 w-5 text-green-600" />}
                        <span className="font-medium">
                            {successMessage || errorMessage}
                        </span>
                        <button
                            onClick={() => {
                                setSuccessMessage('');
                                setErrorMessage('');
                            }}
                            className={`p-1 rounded-full hover:bg-opacity-20 ${
                                successMessage ? 'hover:bg-green-200' : 'hover:bg-red-200'
                            }`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
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
                    
                    <div className="flex items-center gap-4">
                        {activeTab === 'profile' && (
                            <Button 
                                variant="primary" 
                                size="lg"
                                className="w-full lg:w-auto"
                                onClick={handleSaveProfile}
                                disabled={isProfileSaving}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {isProfileSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                                </span>
                                <span className="sm:hidden">
                                    {isProfileSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                                </span>
                            </Button>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Navigation Tabs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="p-4 sm:p-6">
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
                                                {user?.roles?.includes(Role.ADMIN) && (
                                                    <Badge variant="info">Admin</Badge>
                                                )}
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
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => handlePasswordUpdate('currentPassword', e.target.value)}
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
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordUpdate('newPassword', e.target.value)}
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
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordUpdate('confirmPassword', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="Confirmez le nouveau mot de passe"
                                            />
                                        </div>
                                        
                                        <Button 
                                            variant="primary" 
                                            size="lg"
                                            className="w-full sm:w-auto"
                                            onClick={handleSavePassword}
                                            disabled={isPasswordSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                        >
                                            {isPasswordSaving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
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
