import { useCurrentUser } from '@/lib/user';
import CreateProfileInvestor from '@/page-components/CreateProfile/CrateProfileInvestor';
import CreateProfileStartup from '@/page-components/CreateProfile/CreateProfileStartup';
import Head from 'next/head';

const ProfilePage = () => {
  const { data, error, mutate } = useCurrentUser();

  const user = data?.user?.role;
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {user == 'investor' && <CreateProfileInvestor />}
      {user == 'startup' && <CreateProfileStartup />}
      {user == 'provider' && <CreateProfileStartup />}
    </>
  );
};

export default ProfilePage;
