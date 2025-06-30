import { UserRole } from '@shared/dto';

// Mapping of the hierarchy: each role inherits directly from the listed roles
export const roleHierarchy: { [key: string]: UserRole[] } = {
    [UserRole.USER]: [],
    [UserRole.ADMIN]: [UserRole.USER],
};

// Recursive function to check the transitive inheritance of roles
export function hasInheritedRole(currentRole: UserRole, requiredRole: UserRole): boolean {
    if (currentRole === requiredRole) return true;
    if (!roleHierarchy[currentRole]) return false;
    for (const inheritedRole of roleHierarchy[currentRole]) {
        if (hasInheritedRole(inheritedRole, requiredRole)) {
            return true;
        }
    }
    return false;
}
