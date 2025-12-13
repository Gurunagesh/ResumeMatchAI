'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  User,
} from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance)
    .catch((error) => {
        // Handle Errors here.
        console.error("Anonymous sign-in error:", error);
    });
}

/** Initiate email/password sign-up and link with anonymous account if available. */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  const currentUser = authInstance.currentUser;

  try {
    // If there's a current anonymous user, we'll try to link.
    if (currentUser && currentUser.isAnonymous) {
      // First, create the credential
      const credential = EmailAuthProvider.credential(email, password);
      // Then, link the new credential with the anonymous account.
      await linkWithCredential(currentUser, credential);
      // The user is now upgraded from anonymous to a permanent account.
      // The onAuthStateChanged listener will handle the user state update.
    } else {
      // If there's no anonymous user, just create a new user.
      await createUserWithEmailAndPassword(authInstance, email, password);
    }
  } catch (error: any) {
    console.error("Sign-up/linking error:", error);
    // You might want to re-throw the error or use a toast to notify the user
    throw error;
  }
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  // signInWithEmailAndPassword returns a promise, but we won't block on it.
  // We'll let the onAuthStateChanged listener handle the result.
  // We add a .catch to handle immediate errors like network issues or invalid formats.
  return signInWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
        console.error("Sign-in error:", error);
        // Re-throw the error so the calling component knows the sign-in failed.
        throw error;
    });
}
