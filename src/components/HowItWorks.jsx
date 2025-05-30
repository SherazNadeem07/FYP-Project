// components/HowItWorks.jsx
export default function HowItWorks() {
  return (
    <>   
    <div id="work">
     <div className="w-full mx-auto p-4 md:p-6 font-sans max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-left pb-2 ">
        How It Works
      </h2>
      
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 cursor-pointer ">
        {/* Step 1 */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium">Create Account</h3>
        </div>
        
        {/* Step */}
        <div className="bg-white p-4 rounded-lg hover:bg-gray-200 border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium">Submit Your Pitch</h3>
        </div>
        
        {/* Step 3 */}
        <div className="bg-white p-4 rounded-lg hover:bg-gray-200 border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium">Connect With Investors</h3>
        </div>
        
        {/* Step 4 */}
        <div className="bg-white p-4 rounded-lg hover:bg-gray-200 border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-orange-100 p-2 rounded-full mr-3">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium">Get Funded</h3>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}