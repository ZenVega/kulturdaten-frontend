import { NextPage } from 'next';
import Link from 'next/link';

import { RegisterForm } from '../../../components/auth/Register';
import { routes, useLocale } from '../../../lib/routing';

const RegisterPage: NextPage = () => {
  const locale = useLocale();

  return (
    <>
      <div>
        <Link href={routes.index({ locale })}>
          <a>Home page</a>
        </Link>
      </div>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
