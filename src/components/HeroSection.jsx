import React from "react";
export default function Content() {

  return (
    <>
    <section className="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white body-font">
  <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">
        Pitch Your Dream Attract Investors<br className="hidden lg:inline-block" />Build the Future
      </h1>
      <p className="mb-8 leading-relaxed text-indigo-100">
        Join the platform where ambitious pitchers meet serious investors. 
        Get the funding, mentorship, and exposure your startup needs to succeed. 
        Our investors have funded over 500 startups with a combined valuation of $2B+.
      </p>
      <div className="flex justify-center">
        <button className="inline-flex text-white bg-indigo-600 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-700 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300">
          Start Your Journey
        </button>
        <button className="ml-4 inline-flex text-indigo-600 bg-white border-0 py-3 px-8 focus:outline-none hover:bg-indigo-50 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300">
          Become an Investor
        </button>
      </div>
      <div className="mt-8 flex items-center space-x-4">
        <div className="flex -space-x-4">
          <img className="w-12 h-12 border-2 border-white rounded-full" src="https://randomuser.me/api/portraits/women/44.jpg" alt="investor" />
          <img className="w-12 h-12 border-2 border-white rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="investor" />
          <img className="w-12 h-12 border-2 border-white rounded-full" src="https://randomuser.me/api/portraits/women/68.jpg" alt="investor" />
        </div>
        <span className="text-indigo-200 text-sm">
          Join 500+ investors actively funding startups
        </span>
      </div>
    </div>
    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <img 
        className="object-cover object-center rounded-xl shadow-2xl border-4 border-white" 
        alt="Startup pitch" 
        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=720&h=600" 
      />
    </div>
  </div>
</section>
    </>
  );
}