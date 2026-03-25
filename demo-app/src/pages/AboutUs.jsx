import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-32 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black">ABOUT US</h1>
      </div>

      {/* Hero Section with placeholder image */}
      <div className="bg-gray-300 h-64 md:h-80 flex items-center justify-center mb-8">
        <div className="text-4xl text-gray-600">• • •</div>
      </div>

      {/* Purpose Section 1 */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-300 h-48 rounded-lg"></div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">PURPOSE</h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui harum
              voluptatem adipisci, unde aliquid numquam architecto, veniam
              accusamus quos molestiae saepe dicta nobis pariatur. Temporibus
              minima fugit, tempora iusto, ad possimus soluta hic praesentium
              mollitia consequatur beatae, aspernatur culpa. Dolorum, libero
              optio. Deserunt fugiat, repellendus eligendi explicabo magni
              obcaecati ab delectus.
            </p>
          </div>
        </div>
      </div>

      {/* Purpose Section 2 */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-2/3 order-2 md:order-1">
            <h2 className="text-2xl font-bold mb-4">PURPOSE</h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui harum
              voluptatem adipisci, unde aliquid numquam architecto, veniam
              accusamus quos molestiae saepe dicta nobis pariatur. Temporibus
              minima fugit, tempora iusto, ad possimus soluta hic praesentium
              mollitia consequatur beatae, aspernatur culpa. Dolorum, libero
              optio. Deserunt fugiat, repellendus eligendi explicabo magni
              obcaecati ab delectus.
            </p>
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            <div className="bg-gray-300 h-48 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Former Directors Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Former Directors of CGU
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Director 1 */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-yellow-600 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Director"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center h-full text-center sm:text-left">
              <h3 className="font-bold text-lg md:text-xl">Mr. ABC</h3>
              <p className="text-gray-600 text-base">Position</p>
              <p className="text-gray-600 text-sm">Since 2017-2024</p>
            </div>
          </div>

          {/* Director 2 */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-yellow-600 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Director"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center h-full text-center sm:text-left">
              <h3 className="font-bold text-lg md:text-xl">Mr. ABC</h3>
              <p className="text-gray-600 text-base">Position</p>
              <p className="text-gray-600 text-sm">Since 2017-2024</p>
            </div>
          </div>

          {/* Director 3 */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-yellow-600 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Director"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center h-full text-center sm:text-left">
              <h3 className="font-bold text-lg md:text-xl">Mr. ABC</h3>
              <p className="text-gray-600 text-base">Position</p>
              <p className="text-gray-600 text-sm">Since 2017-2024</p>
            </div>
          </div>

          {/* Director 4 */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-yellow-600 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Director"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center h-full text-center sm:text-left">
              <h3 className="font-bold text-lg md:text-xl">Mr. ABC</h3>
              <p className="text-gray-600 text-base">Position</p>
              <p className="text-gray-600 text-sm">Since 2017-2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-gray-200 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold">
                YouTube Video Placeholder
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
