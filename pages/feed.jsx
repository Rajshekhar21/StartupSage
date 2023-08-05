import { useCurrentUser } from '@/lib/user';
import CreateProfileInvestor from '@/page-components/CreateProfile/CrateProfileInvestor';
import CreateProfileMentor from '@/page-components/CreateProfile/CrateProfileMentor';
import CreateProfileStartup from '@/page-components/CreateProfile/CreateProfileStartup';
import Head from 'next/head';

const FeedPage = () => {
  const { data } = useCurrentUser();
  // const { data, error, mutate } = useCurrentUser();

  const user = data?.user?.role;
  console.log('user', user);
  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      {user == 'investor' && <CreateProfileInvestor />}
      {user == 'mentor' && <CreateProfileMentor />}
      {user == 'startup' && <CreateProfileStartup />}
      {user == 'provider' && <CreateProfileStartup />}
    </>
  );
};

export default FeedPage;
