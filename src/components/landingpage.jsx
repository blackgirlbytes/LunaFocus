import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useWeb5 } from '@/context/Web5Context';
import Username from '@/lib/dwn/username';

export function LandingPage() {
  const [hasUsername, setHasUsername] = useState(false);
  const { web5, userDid } = useWeb5();
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      if (web5 && userDid) {
        try {
          const user = await Username(web5, userDid);
          const username = await user.fetchUsername();
          if (username !== 'User') {
            setHasUsername(true);
          } else {
            setHasUsername(false);
          }
        } catch (error) {
          console.error('Error checking username:', error);
        }
      }
    };
    checkUsername();
  }, [web5, userDid]);

  const handleGetStarted = () => {
    if (hasUsername) {
      router.push('/calendar');
    } else {
      router.push('/Login');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12 lg:py-16 xl:py-24 bg-[#FFFFFF]">
          <div className="container px-4 md:px-6 mx-auto max-w-[1200px]">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#000080]">
                    Your Health, Your Choices, Your Data.
                  </h1>
                  <p className="max-w-[600px] text-[#333333] md:text-xl">
                    LunaLock prioritizes your data privacy and personal ownership, providing customizable tools to support you every step of the way.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#000080] px-8 text-sm font-medium text-[#FFFFFF] shadow-md transition-colors hover:bg-[#000080] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000080] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </button>
                  <Link
                    href="/DataPrivacy"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#ADD8E6] bg-[#FFFFFF] px-8 text-sm font-medium shadow-md transition-colors hover:bg-[#E6E6FA] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ADD8E6] disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <img
                src="/images/infantwfam.jpg"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#E6E6FA]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#FFFFFF] px-3 py-1 text-sm text-[#333333]">
                  Data Privacy
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#000080]">
                  Your Data, Your Control
                </h2>
                <p className="max-w-[900px] text-[#333333] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We believe in empowering you with complete control of your personal information.
                  LunaLock is designed to keep your data secure and private, allowing you to manage and own your health journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/images/babylaptop.jpg"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#000080]">Personalized Tracking</h3>
                      <p className="text-[#333333]">
                        Customize your pregnancy tracking to suit your unique needs and preferences.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#000080]">Own Your Data</h3>
                      <p className="text-[#333333]">
                        Maintain full control and ownership over your personal health data, with the ability to
                        export or delete it at any time.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#000080]">Seamless Sharing</h3>
                      <p className="text-[#333333]">
                        Easily share your health information, while maintaining control over your
                        data.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#000080]">Encrypted Data Storage (Coming Soon)</h3>
                      <p className="text-[#333333]">
                        Your sensitive information will be securely encrypted and stored, ensuring your privacy is
                        protected.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#FFFFFF] flex flex-col items-center justify-center">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10 mx-auto max-w-[1200px]">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-[#000080]">
                Support for all outcomes
              </h2>
              <p className="max-w-[600px] text-[#333333] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Life's journey takes many paths. From IVF to adoption, loss to postpartum - LunaLock ensures your story remains yours to share.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#000080] px-8 text-sm font-medium text-[#FFFFFF] shadow-md transition-colors hover:bg-[#000080] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000080] disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Explore Features
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#ADD8E6] bg-[#FFFFFF] px-8 text-sm font-medium shadow-md transition-colors hover:bg-[#E6E6FA] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ADD8E6] disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#E6E6FA]">
          <div className="container px-4 md:px-6 mx-auto max-w-[1200px]">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-[#FFFFFF] px-3 py-1 text-sm text-[#000080]">Testimonial</div>
                <blockquote className="text-lg font-semibold leading-snug lg:text-xl lg:leading-normal xl:text-2xl text-[#333333]">
                  &ldquo;Dear tech companies, I don’t want to see pregnancy ads after my child was stillborn.&ldquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-[#000080]">Gillian Brockell, Staff Writer</div>
                    <div className="text-sm text-[#333333]">
                      <Link
                        href="https://www.washingtonpost.com/lifestyle/2018/12/12/dear-tech-companies-i-dont-want-see-pregnancy-ads-after-my-child-was-stillborn/?noredirect=on"
                        prefetch={false}
                      >
                        Washington Post
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-[#FFFFFF] px-3 py-1 text-sm text-[#000080]">Twitter</div>
                <div className="bg-[#FFFFFF] rounded-lg shadow-md p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>PT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-[#000080]">@mozilla</div>
                      <div className="text-sm text-[#333333]">Mozilla</div>
                    </div>
                  </div>
                  <p className="text-[#333333] mt-4">
                    We reviewed 20 popular reproductive health tracking apps, and awarded 18 our #PrivacyNotIncluded warning label 😲
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[#333333]">
                      <HeartIcon className="w-4 h-4" />
                      <span>25</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#333333]">
                      <MessageCircleIcon className="w-4 h-4" />
                      <span>10</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#333333]">
                      <RepeatIcon className="w-4 h-4" />
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-[#E6E6FA] shadow-md">
        <p className="text-xs text-[#333333]">&copy; 2024 LunaLock. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/DataPrivacy"
            className="text-xs hover:text-[#000080] text-[#333333]"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:text-[#000080] text-[#333333]" prefetch={false}>
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function RepeatIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
