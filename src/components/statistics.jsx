export function Statistics() {

    return (
      <div className="container mx-auto p-4">

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#000080]">
            Statistics
          </h1>
          <p className="max-w-[600px] text-[#333333] md:text-xl">
            These statistics have been calculate based on your last three cycles.
          </p>
        </div>
  
        <main className="flex flex-col items-center justify-center py-4">
          <h2 className="text-xl font-bold mb-4">Your average cycle length is</h2>
          <p className="text-xl mb-8 text-center">28 days</p>
  
          <h2 className="text-xl font-bold mb-4">Your next predicted cycle will start on</h2>
          <p className="text-xl mb-8 text-center">Fri, 5 July 2024</p>
  
          <h2 className="text-xl font-bold mb-4">First day of last period</h2>
          <p className="text-xl mb-8 text-center">Fri, 7 June 2024</p>
        </main>
      </div>
    );

}