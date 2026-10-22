import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/auth';
import { dbService } from '../services/storage/databaseService';
import { isFirebaseConfigured, auth as firebaseAuth } from '../services/firebase/config';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  departmentId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isFirebaseMode: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUserRoleForTesting: (uid: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sapie_current_user_uid';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase is configured and live, listen to Firebase Auth state
    if (isFirebaseConfigured && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          const profile = dbService.getUserByEmail(fbUser.email || '') || {
            uid: fbUser.uid,
            email: fbUser.email || '',
            fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
            role: 'pensyarah' as UserRole,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local persistent mode: check saved active user session
      const savedUid = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUid) {
        const found = dbService.getUserById(savedUid);
        if (found && found.active) {
          setUser(found);
        } else {
          // Default to Super Admin so institutional testing starts smoothly
          const defaultAdmin = dbService.getUsers()[0];
          if (defaultAdmin) {
            setUser(defaultAdmin);
            localStorage.setItem(AUTH_STORAGE_KEY, defaultAdmin.uid);
          }
        }
      } else {
        // First visit: select default Super Admin
        const defaultAdmin = dbService.getUsers()[0];
        if (defaultAdmin) {
          setUser(defaultAdmin);
          localStorage.setItem(AUTH_STORAGE_KEY, defaultAdmin.uid);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      if (isFirebaseConfigured && firebaseAuth) {
        await signInWithEmailAndPassword(firebaseAuth, email, password || '');
        const profile = dbService.getUserByEmail(email);
        if (profile) setUser(profile);
      } else {
        // Persistent database authentication
        const foundUser = dbService.getUserByEmail(email);
        if (!foundUser) {
          setError('Alamat e-mel tidak berdaftar dalam sistem SAPIe.');
          setLoading(false);
          return false;
        }

        if (!foundUser.active) {
          setError('Akaun anda telah dinyahaktifkan oleh pihak pentadbir.');
          setLoading(false);
          return false;
        }

        setUser(foundUser);
        localStorage.setItem(AUTH_STORAGE_KEY, foundUser.uid);

        dbService.createAuditLog({
          actorUid: foundUser.uid,
          actorName: foundUser.fullName,
          actorRole: foundUser.role,
          action: 'LOGIN',
          entityType: 'Auth',
          entityIdentifier: foundUser.email,
          outcome: 'Berjaya',
          details: `Log masuk berjaya ke sistem SAPIe (${foundUser.fullName} - ${foundUser.role})`,
        });
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Log masuk gagal. Sila semak kelayakan anda.');
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (user) {
      dbService.createAuditLog({
        actorUid: user.uid,
        actorName: user.fullName,
        actorRole: user.role,
        action: 'LOGOUT',
        entityType: 'Auth',
        entityIdentifier: user.email,
        outcome: 'Berjaya',
        details: `Log keluar dari sistem SAPIe`,
      });
    }

    if (isFirebaseConfigured && firebaseAuth) {
      await firebaseSignOut(firebaseAuth);
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  // Switch role seamlessly for testing all 5 roles requested
  const switchUserRoleForTesting = (uid: string) => {
    const target = dbService.getUserById(uid);
    if (target) {
      setUser(target);
      localStorage.setItem(AUTH_STORAGE_KEY, target.uid);
      dbService.createAuditLog({
        actorUid: target.uid,
        actorName: target.fullName,
        actorRole: target.role,
        action: 'LOGIN',
        entityType: 'Auth',
        entityIdentifier: target.email,
        outcome: 'Berjaya',
        details: `Tukar sesi aktif kepada: ${target.fullName} (${target.role})`,
      });
    }
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = dbService.updateUser(user.uid, updates, user);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        departmentId: user?.departmentId || null,
        isAuthenticated: Boolean(user),
        loading,
        error,
        isFirebaseMode: isFirebaseConfigured,
        login,
        logout,
        switchUserRoleForTesting,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
