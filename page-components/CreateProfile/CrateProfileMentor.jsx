// import { Button } from '@/components/Button';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
// import { PhotoIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

function createRefsForReads() {
  return { link: React.createRef(), type: React.createRef() };
}

export default function CreateProfileMentor({ isEditMode, toggleEditMode }) {
  const [reads, setReads] = useState([createRefsForReads()]);

  const projectNameRef = useRef();
  const onelinerRef = useRef();
  const leaderFirstNameRef = useRef();
  const leaderLastNameRef = useRef();
  const leaderEmailRef = useRef();
  const leaderLinkdinRef = useRef();
  const fileUploadRef = useRef();

  // const [submittedData, setSubmittedData] = useState(null);

  const { data, error, mutate } = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    if (!data && !error) return;
    if (!data?.user) {
      router.replace('/login');
    }
  }, [router, data, error]);

  /**
   
   */

  useEffect(() => {
    if (isEditMode) {
      const {
        projectName,
        oneLiner,
        owner,
        file,
        reads: savedReads,
      } = isEditMode.profile;
      const { firstName, lastName, linkdin, email } = owner;
      projectNameRef.current.value = projectName;
      onelinerRef.current.value = oneLiner;
      fileUploadRef.current.value = file;

      leaderLinkdinRef.current.value = linkdin;
      leaderEmailRef.current.value = email;
      leaderFirstNameRef.current.value = firstName;
      leaderLastNameRef.current.value = lastName;

      if (savedReads.length > 0) {
        const newFields = savedReads.map((read) => {
          const reff = createRefsForReads();
          reff.link.current = read.link;
          reff.type.current = read.type;

          return reff;
        });

        setReads(newFields);
      }
    }
  }, [isEditMode]);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const payload = {
        projectName: projectNameRef.current.value,
        oneLiner: onelinerRef.current.value,
        owner: {
          firstName: leaderFirstNameRef.current.value,
          lastName: leaderLastNameRef.current.value,
          email: leaderEmailRef.current.value,
          linkdin: leaderLinkdinRef.current.value,
        },
        reads: reads.map((read) => ({
          type: read.type.current.value,
          link: read.link.current.value,
        })),
        file: undefined,
        //fileUploadRef.current.files[0]
        // You can include any other field as required
      };

      // debugger;
      const response = await fetcher('/api/profile', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(response);
    } catch (error) {
      toast.error('Unable to create profile');
    }
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className="xxl:w-1/2 xl:w-2/3 md:w-4/5">
        <form onSubmit={onSubmit}>
          <div className="space-y-12">
            <div className=" border-gray-900/10 pb-12">
              <h1
                className="text-base text-4xl leading-7 text-gray-900"
                style={{
                  fontSize: '60px',
                  textAlign: 'center',
                }}
              >
                {isEditMode ? 'Edit Profile' : 'Mentor Onboarding Form'}
              </h1>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-3">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Which kind of startup would you like to Mentor ?
                  </label>
                  <div className="mt-2">
                    <textarea
                      required
                      ref={onelinerRef}
                      id="one-liner"
                      name="one-liner"
                      rows={3}
                      className="block w-full h-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 mt-4 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                      Validate who to connect with
                    </button>
                  </div>
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    I would rate this statement as a 6 out of 10 in terms of
                    effectively describing the types of startups you wish to
                    invest in. While it mentions that you are open to investing
                    in any startup, it also specifies that you have a preference
                    for startups targeting Africa. This indicates that you have
                    a specific focus or area of expertise, which is useful
                    information for potential investment opportunities. However,
                    the statement does not provide any other criteria or
                    priorities that you might have for evaluating potential
                    investments, such as the stage of the startup, the industry
                    it operates in, or the size of the investment. Including
                    more information about your investment criteria could help
                    to provide a clearer picture of the types of startups you
                    are interested in and make it easier for other companies to
                    understand whether they might be a good fit.
                  </label>
                </div>
              </div>
            </div>

            <div className=" border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-600">
                Your Contact info
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="leader-first-name"
                    className="block text-sm font-medium leading-6 text-gray-800"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      ref={leaderFirstNameRef}
                      type="text"
                      name="leader-first-name"
                      id="leader-first-name"
                      autoComplete="leader-first-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      ref={leaderLastNameRef}
                      type="text"
                      name="leader-last-name"
                      id="leader-last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      ref={leaderEmailRef}
                      type="text"
                      autoComplete="email"
                      name="leader-email"
                      id="leader-email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Linkdin
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      ref={leaderLinkdinRef}
                      type="text"
                      name="leader-linkdin"
                      id="leader-linkdin"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-600">
                Additional read (website, pitch deck, Calendly, Google Slides,
                LinkTree, Notion, BriefLink etc.. )
              </h2>
              {reads.map((read, index) => (
                <div
                  key={index}
                  className="mt-10 grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-6"
                >
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Type
                    </label>
                    <div className="mt-2">
                      <select
                        ref={read.type}
                        id={`type-${index}`}
                        name={`type-${index}`}
                        autoComplete="country-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value={'pitch-deck'}>Pitch Deck</option>
                        <option value={'website'}>Website</option>
                        <option value={'github'}>GitHub</option>
                        <option value={'notion'}>Notion</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Link
                    </label>
                    <div className="mt-2 flex">
                      <input
                        required
                        ref={read.link}
                        type="text"
                        id={`link-ad-read-${index}`}
                        name={`link-ad-read-${index}`}
                        autoComplete="given-name"
                        className="block me-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        className="bg-green-600 text-white  h-8 w-8 rounded"
                        onClick={() => {
                          const newReads = [...reads];
                          newReads.splice(index, 1);
                          setReads(newReads);
                        }}
                      >
                        -
                      </button>
                    </div>
                  </div>
                  {index + 1 == reads.length && (
                    <div className="sm:col-span-1">
                      <div
                        className="mt-[32px]"
                        style={{
                          display: 'flex',
                          alignTtems: 'end',
                        }}
                      >
                        <button
                          className="bg-green-600 text-white h-8 w-8 rounded"
                          onClick={() => {
                            setReads([...reads, createRefsForReads()]);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Profile Image Url
                  </label>
                  {/* <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500"
                        >
                          <span>Upload a file</span>
                          <input
                            ref={fileUploadRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div> */}
                </div>
                <div className="col-span-2">
                  <input
                    required
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-start gap-x-6">
            {/* <button
              onClick={() => {
                if (isEditMode) {
                  toggleEditMode(false);
                }
              }}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
