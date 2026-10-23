import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { Project, SiteSettings, AdminUser } from '../../types';
import { initialProjects, initialSettings } from '../initialData';
import { IProjectRepository, ISettingsRepository, IAuthRepository } from './types';
import { generateSlug } from '../utils';

const ADMIN_ALLOWLIST = (import.meta.env.VITE_ADMIN_EMAILS || 'ifeanyinuels42@gmail.com,ifeanyinuels32@gmail.com')
  .split(',')
  .map((e: string) => e.trim().toLowerCase());

export class FirebaseProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    if (!db) throw new Error('Firestore is not initialized');
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed initial data to Firestore
      for (const p of initialProjects) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
      return initialProjects;
    }

    return snapshot.docs.map((docSnap) => docSnap.data() as Project);
  }

  async getPublished(): Promise<Project[]> {
    if (!db) throw new Error('Firestore is not initialized');
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('status', '==', 'published'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data() as Project);
  }

  async getBySlug(slug: string): Promise<Project | null> {
    if (!db) throw new Error('Firestore is not initialized');
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Project;
  }

  async getById(id: string): Promise<Project | null> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as Project;
  }

  async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    if (!db) throw new Error('Firestore is not initialized');
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const slug = projectData.slug || generateSlug(projectData.title);

    const newProject: Project = {
      ...projectData,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'projects', id), newProject);
    return newProject;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'projects', id);
    const updated = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updated);
    const finalDoc = await getDoc(docRef);
    return finalDoc.data() as Project;
  }

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'projects', id));
  }

  async reorder(orderedIds: string[]): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await updateDoc(doc(db, 'projects', id), {
        order: index + 1,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async resetToDefaults(): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    // Clear and re-seed
    const snapshot = await getDocs(collection(db, 'projects'));
    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
    for (const p of initialProjects) {
      await setDoc(doc(db, 'projects', p.id), p);
    }
  }
}

export class FirebaseSettingsRepository implements ISettingsRepository {
  async get(): Promise<SiteSettings> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'settings', 'site');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, initialSettings);
      return initialSettings;
    }
    return docSnap.data() as SiteSettings;
  }

  async update(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'settings', 'site');
    const updated = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, updated, { merge: true });
    return this.get();
  }

  async resetToDefaults(): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'settings', 'site');
    await setDoc(docRef, initialSettings);
  }
}

export class FirebaseAuthRepository implements IAuthRepository {
  getCurrentUser(): AdminUser | null {
    if (!auth || !auth.currentUser) return null;
    const fbUser = auth.currentUser;
    const email = fbUser.email?.toLowerCase() || '';
    const isAdmin = ADMIN_ALLOWLIST.includes(email);
    return {
      uid: fbUser.uid,
      email,
      displayName: fbUser.displayName || undefined,
      isAdmin,
    };
  }

  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }

    return fbOnAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      const email = fbUser.email?.toLowerCase() || '';
      const isAdmin = ADMIN_ALLOWLIST.includes(email);
      callback({
        uid: fbUser.uid,
        email,
        displayName: fbUser.displayName || undefined,
        isAdmin,
      });
    });
  }

  async signInWithEmail(email: string, pass: string): Promise<AdminUser> {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const userEmail = cred.user.email?.toLowerCase() || '';
    const isAdmin = ADMIN_ALLOWLIST.includes(userEmail);
    if (!isAdmin) {
      await fbSignOut(auth);
      throw new Error(`Unauthorized: Account ${userEmail} is not an authorized administrator.`);
    }
    return {
      uid: cred.user.uid,
      email: userEmail,
      displayName: cred.user.displayName || undefined,
      isAdmin: true,
    };
  }

  async signInWithGoogle(): Promise<AdminUser> {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userEmail = cred.user.email?.toLowerCase() || '';
    const isAdmin = ADMIN_ALLOWLIST.includes(userEmail);
    if (!isAdmin) {
      await fbSignOut(auth);
      throw new Error(`Unauthorized: Google account ${userEmail} is not on the admin allowlist.`);
    }
    return {
      uid: cred.user.uid,
      email: userEmail,
      displayName: cred.user.displayName || undefined,
      isAdmin: true,
    };
  }

  async signOut(): Promise<void> {
    if (!auth) return;
    await fbSignOut(auth);
  }

  isConfigured(): boolean {
    return true;
  }
}
