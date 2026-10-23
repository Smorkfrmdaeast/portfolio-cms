import { isFirebaseConfigured } from '../firebase';
import { IProjectRepository, ISettingsRepository, IAuthRepository } from './types';
import { LocalProjectRepository, LocalSettingsRepository, LocalAuthRepository } from './LocalRepository';
import { FirebaseProjectRepository, FirebaseSettingsRepository, FirebaseAuthRepository } from './FirebaseRepository';

let projectRepository: IProjectRepository;
let settingsRepository: ISettingsRepository;
let authRepository: IAuthRepository;

if (isFirebaseConfigured) {
  projectRepository = new FirebaseProjectRepository();
  settingsRepository = new FirebaseSettingsRepository();
  authRepository = new FirebaseAuthRepository();
} else {
  projectRepository = new LocalProjectRepository();
  settingsRepository = new LocalSettingsRepository();
  authRepository = new LocalAuthRepository();
}

export { projectRepository, settingsRepository, authRepository };
export const isUsingFirebase = isFirebaseConfigured;
export * from './types';
