import { ref, onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '@/firebase';

const user = ref<User | null>(null);
const authLoading = ref(true);

export function useAuth() {
  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      authLoading.value = false;
    });
  });

  return {
    user,
    authLoading,
  };
}
