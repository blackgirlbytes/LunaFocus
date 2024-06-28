import { useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb5 } from '@/context/Web5Context';
import { useUser } from '@/context/UserContext';
import Username from '@/lib/dwn/username';

export function LoginPage() {
  const { web5, userDid } = useWeb5();
  const { username, setUsername } = useUser();
  const [userType, setUserType] = useState('');
  const router = useRouter();

  async function storeUsername() {
    if (web5 && userDid && username) {
      try {
        const user = await Username(web5, userDid);
        await user.createOrUpdateUsernameEntry({ username });
        setUsername(username);
        router.push('/calendar');
      } catch (error) {
        console.error('Error storing username:', error);
      }
    }
  }

  const LunaBenefits = () => {
    const benefits = [
      'Your Data, Your Control',
      'Personalized Tracking',
      'Own Your Data',
      'Seamless Sharing',
      'Encrypted Data Storage (Coming Soon)',
      'Support for all outcomes',
    ];

    return (
      <>
        <h1 className="text-2xl mt-8 font-bold">LunaFocus User Portal</h1>
        {benefits.map((benefit, index) => (
          <p key={index} className="py-2">
            ✓ <span className="font-semibold" dangerouslySetInnerHTML={{ __html: benefit }} />
          </p>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div className="">
            <div className="hero min-h-full rounded-l-xl bg-base-200">
              <div className="hero-content py-12">
                <div className="max-w-md">
                  <h1 className="text-3xl text-center font-bold">
                    LunaFocus
                  </h1>
                  <div className="text-center mt-12">
                    <img
                      src="/images/infantwfam.jpg"
                      alt="Hero"
                      className="w-96 inline-block"
                    />
                  </div>
                  {/* Display the benefits */}
                  <LunaBenefits />
                </div>
              </div>
            </div>
          </div>
          <LoginForm
            username={username}
            setUsername={setUsername}
            userType={userType}
            setUserType={setUserType}
            storeUsername={storeUsername}
          />
        </div>
      </div>
    </div>
  );
}

const LoginForm = ({ username, setUsername, userType, setUserType, storeUsername }) => {
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="py-24 px-10">
      <h2 className="text-2xl font-semibold mb-2 text-center">LunaFocus Username</h2>
      <form onSubmit={(e) => { e.preventDefault(); storeUsername(); }}>
        {/* Username */}
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text text-base-content">Username</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="input input-bordered w-full"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text text-base-content">Select Your Role</span>
          </label>
          <select
            value={userType}
            onChange={handleUserTypeChange}
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select one</option>
            <option value="self">Self</option>
            <option value="provider">Provider</option>
            <option value="partner">Partner</option>
          </select>
        </div>

        {/* Set Username Button */}
        <button type="submit" className="btn mt-2 w-full btn-accent">
          Set Username
        </button>

        {/* Register Link */}
        <div className="text-center mt-4">
          No Password with Web 5{' '}
          <a href="/register">
            <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
              Learn More
            </span>
          </a>
        </div>
      </form>
    </div>
  );
};
