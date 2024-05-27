// import SignInForm from '@/ui/auth/SignInForm';

import Modal from '@/components/Modal/Modal';
import LoginForm from '@/ui/auth/LoginForm';
// import SignInForm from '@/ui/auth/SignInForm';

export default async function Page() {
  return (
    <Modal>
      <LoginForm />
    </Modal>
  );
}
