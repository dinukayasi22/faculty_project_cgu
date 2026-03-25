import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 pb-8 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
          Career Guidance Unit
        </h1>
        <div className="bg-background-muted rounded-full px-6 sm:px-12 md:px-20 py-3 text-center text-base md:text-lg text-gray-700 font-normal inline-block">
          "Building Connections From Campus to Community"
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="bg-gray-300 h-64 md:h-80 lg:h-96 flex items-center justify-center mb-12">
        <div className="text-4xl text-gray-600">• • •</div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-300 h-48 md:h-64 rounded-lg"></div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">INTRODUCTION</h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui harum voluptatem adipisci, unde aliquid numquam architecto, veniam accusamus quos molestiae saepe dicta nobis pariatur. Temporibus minima fugit, tempora iusto, ad possimus soluta hic praesentium mollitia consequatur beatae, aspernatur culpa. Dolorum, libero optio. Deserunt fugiat, repellendus eligendi explicabo magni obcaecati ab delectus.
            </p>
          </div>
        </div>
      </div>

      {/* Contact and Location Section */}
      <div className="bg-background-muted py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Us */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">CONTACT US</h2>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">General Numbers:</span> 025 1234567</p>
                <p><span className="font-semibold">General Fax:</span> 7383280240</p>
                <p><span className="font-semibold">Email:</span> abc@gmail.com</p>
                <p><span className="font-semibold">Address:</span> Rajarata University of Srilanka, Mihinthale</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">LOCATION</h2>
              <div className="bg-gray-300 h-48 md:h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  </div>
                  <p className="font-semibold">Map Location</p>
                  <p className="text-sm">Rajarata University of Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">FOLLOW US ON SOCIAL MEDIA</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="#" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
