export function DataPrivacyPage() {
  return (
    <div className="bg-[#FFFFFF] text-[#333333] font-sans">
      <header className="bg-[#E6E6FA] text-white py-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#000080]">Your data at LunaLock</h1>
        </div>
      </header>
      <main>
        <section className="py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 text-[#000080]">How we ensure your security</h3>
            <p className="text-lg mb-8">
              LunaLock is a personal health tracking app built with Web5 that prioritizes user ownership and data privacy.
              In simple terms, unlike many personal health tracking apps that store, sell, and access your data, LunaLock ensures that only you can access your data in a personal data store, giving you full control over who you share your information with.
              Learn more about Web5:
            </p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', marginBottom: '20px' }}>
              <iframe
                src="https://www.youtube.com/embed/KgZYtsj9-V0"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 mt-8 text-[#000080]">How we identify you</h3>
            <p className="text-lg mb-8">
              When you log into your account on LunaLock, unlike regular applications where you are authenticated and identified by your username and password, we create a digital identifier that is unique to you known as a Decentralized Identifier (DID).
              As a user, you have full control of your DID because DIDs are not tied to any centralized authority unlike your traditional IDs like a driver’s license or passport which is tied and solely issued by the gorvernment.
              You can use your unique DID to prove your identity and interact with various services online including our application without relying on a third party verification. It is through your DID that others can send messages and data, and be granted access to information you want to share.
              This helps protect your privacy and gives you more control over your data.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-[#000080]">How your data is stored</h3>
            <p className="text-lg mb-8">
              Enterprise products can change terms of service, sell your data, access your data, and  even abruptly shut down services. With LunaLock, your data is kept  in a personal data store called a Decentralized Web Node (DWN).
              DWNs provide a secure space where your data is stored, and you decide who gets access. No one else can access your data unless you choose to, thanks to a special cryptographic algorithm that ensures only the rightful owner of the DWN can access it.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-[#000080]">Coming Soon: Convenient and Secure Identity Verification</h3>
            <p className="text-lg mb-8">
              On our roadmap, we plan to enable the convenience of proving your identity with Verifiable Credentials (VCs). You will be able to store a digital representation of your health insurance card or ID in the application.
              Not to worry, this is the same trusted technology used by Mobile Driver's License. Additionally, VCs provide an additional layer of security where you reveal only the necessary information. For example, if only your date of birth is needed, you can show just that.
              If only your health insurance member ID is needed, other data like your name or date of birth will remain hidden. This ensures your personal information is safe, secure, and only shared when absolutely necessary.
            </p>
            <p className="text-lg mb-2">Learn more about Verifiable Credentials:</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', marginBottom: '20px' }}>
              <iframe
                src="https://www.youtube.com/embed/k9CL1ETxCkU"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 mt-8 text-[#000080]">The missing piece of personal health tracking app</h3>
            <p className="text-lg mb-4">
              Personal health tracking apps have been criticized for a number of reasons, including:
            </p>
            <h3 className="text-xl font-bold mb-2 text-[#000080]">Inclusivity</h3>
            <p className="text-lg mb-2">
              Some apps may use language or images that exclude certain groups of people or people with varying health conditions. Personal health includes more than just pregnancy!
            </p>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8714275/#ocab182-B12" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8714275/#ocab182-B12
            </a>
            <h3 className="text-xl font-bold mb-2 mt-4 text-[#000080]">Privacy</h3>
            <p className="text-lg mb-2">
              Some apps may not adequately protect users' data privacy. For example, a 2022 report by the Mozilla Foundation found that most of 25 popular reproductive health apps had vague privacy policies about how they share data with law enforcement.</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '50px' }}>
              <li className="mb-2"> <a href="https://www.businessinsider.com/mozilla-period-pregnancy-apps-privacy-warning-label-flo-glow-ovia-2022-8" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://www.businessinsider.com/mozilla-period-pregnancy-apps-privacy-warning-label-flo-glow-ovia-2022-8
              </a></li>
              <li className="mb-2"> <a href="https://www.npr.org/2022/05/10/1097482967/roe-v-wade-supreme-court-abortion-period-apps" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://www.npr.org/2022/05/10/1097482967/roe-v-wade-supreme-court-abortion-period-apps
              </a></li>
              <li className="mb-2"> <a href="https://www.ftc.gov/system/files/ftc_gov/pdf/10-Laabadli-Understanding-Womens-Privacy-Concerns-Toward-Period-Tracking-Apps-in-the-Post-Roe-v-Wade-Era.pdf" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://www.ftc.gov/system/files/ftc_gov/pdf/10-Laabadli-Understanding-Womens-Privacy-Concerns-Toward-Period-Tracking-Apps-in-the-Post-Roe-v-Wade-Era.pdf
              </a></li>
              <li className="mb-2"> <a href="https://www.marketplace.org/shows/marketplace-tech/how-data-generated-by-everyday-apps-can-incriminate-abortion-seekers/" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://www.marketplace.org/shows/marketplace-tech/how-data-generated-by-everyday-apps-can-incriminate-abortion-seekers/
              </a></li>
              <li className="mb-2"> <a href="https://time.com/6298166/nebraska-abortion-pill-case-legal-experts/" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://time.com/6298166/nebraska-abortion-pill-case-legal-experts/
              </a></li>
            </ul>
            <h3 className="text-xl font-bold mb-2 mt-4 text-[#000080]">Handling pregnancy loss</h3>
            <p className="text-lg mb-4">
              Some apps may not have a way to report an unsuccessful pregnancy. For example, some apps may only allow users to ignore an outlier cycle, while others may require users to reset the app entirely after a miscarriage or abortion, losing all historical data.
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '50px' }}>
              <li className="mb-2"> <a href="https://mashable.com/article/miscarriage-stillbirth-pregnancy-apps" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://mashable.com/article/miscarriage-stillbirth-pregnancy-apps
              </a></li>
              <li className="mb-2"> <a href="https://www.washingtonpost.com/lifestyle/2018/12/12/dear-tech-companies-i-dont-want-see-pregnancy-ads-after-my-child-was-stillborn/?noredirect=on" style={{ color: '#000080', textDecoration: 'underline', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                https://www.washingtonpost.com/lifestyle/2018/12/12/dear-tech-companies-i-dont-want-see-pregnancy-ads-after-my-child-was-stillborn/?noredirect=on
              </a></li>
            </ul>
            <p className="text-lg mb-4 mt-4">
              Whether you're tracking your menstrual cycle, pregnancy, perimenopause, or other aspects of your health, LunaLock is here for you. Our platform recognizes that health is personal and inclusive of all genders, providing holistic, convenient, and private support for everyone.                 </p>
          </div>
        </section>
      </main>
    </div>
  );
}
