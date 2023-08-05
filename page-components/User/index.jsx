import { useProfile } from '@/lib/profile/hook';
import { useCurrentUser } from '@/lib/user';

import { PaperClipIcon } from '@heroicons/react/20/solid'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CreateProfileInvestor from '../CreateProfile/CrateProfileInvestor';
import CreateProfileStartup from '../CreateProfile/CreateProfileStartup';

export const User = ({ user }) => {
  const { data } = useCurrentUser();
  const { mutate: fetchProfile, data: profile } = useProfile()
  const [isInEditMode, enterEditMode] = useState(false);

  useEffect(() => { fetchProfile() })


  if (!profile) {
    return <div></div>
  }
  const website = profile.profile.reads.find(r => r.type == "website");
  const pitchDeck = profile.profile.reads.find(r => r.type == "pitch-deck");
  
  const userRole = data?.user?.role;
  if (isInEditMode) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        {userRole == 'investor' && <CreateProfileInvestor isEditMode={profile} toggleEditMode={enterEditMode}/>}
        {userRole == 'startup' && <CreateProfileStartup isEditMode={profile} />}
        {userRole == 'provider' && <CreateProfileStartup isEditMode={profile} />}
      </>
    )
  }

  return (
    <div style={{
      margin: '20px'
    }}>
      <div className="px-4 sm:px-0" style={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
        </div>
        <a
          href="#"
          onClick={() => enterEditMode(true)}
          className="rounded-md mt-6 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Profile
        </a>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Company</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile.profile.projectName}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">One liner</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile.profile.oneLiner}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Website</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{website ? website : 'N/A'}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Pitch Deck</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pitchDeck ? pitchDeck.link :  'N/A'}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Founders</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Project links</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
