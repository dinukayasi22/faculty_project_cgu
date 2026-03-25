import React from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const JobView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-2 sm:px-4 py-8 mt-18 pb-20">
      <div className="max-w-4xl mx-auto">
        <button
          className="mb-4 text-2xl md:text-3xl text-black hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <IoArrowBackSharp className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png"
              alt="Company Logo"
              className="w-16 h-16 rounded-lg mx-auto sm:mx-0"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl font-bold">Company Name</h1>
              <p className="text-sm md:text-base text-gray-600">Company Address</p>
              <p className="text-sm md:text-base text-gray-600">E-Mail</p>
              <p className="text-sm md:text-base text-gray-600">Contact Number</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button className="bg-white border-2 border-gray-700 text-gray-700 px-4 md:px-6 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">
              Update
            </button>
            <button className="bg-white border-2 border-gray-700 text-gray-700 px-4 md:px-6 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <section>
            <h2 className="text-lg md:text-xl font-bold mb-2">Brief Introduction :</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui harum voluptatem adipisci, unde aliquid numquam architecto, veniam accusamus quos molestiae saepe dicta nobis pariatur. Temporibus minima fugit, tempora iusto, ad possimus soluta hic praesentium mollitia consequatur beatae, aspernatur culpa. Dolorum, libero optio. Deserunt fugiat, repellendus eligendi explicabo magni obcaecati ab delectus.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg md:text-xl font-bold mb-2">Employer Post</h2>
            <p className="text-sm md:text-base text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold mb-2">Type of Business :</h2>
            <p className="text-sm md:text-base text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold mb-2">Salary :</h2>
            <p className="text-sm md:text-base text-gray-600">$20000</p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold mb-2">Full Time or Part Time :</h2>
            <p className="text-sm md:text-base text-gray-600">Full Time</p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold mb-2">Hybrid or On-Site Work :</h2>
            <p className="text-sm md:text-base text-gray-600">Hybrid Work</p>
          </section>
        </div>

        <div className="mt-6 md:mt-8 flex justify-center">
          <button className="bg-primary text-white px-6 md:px-8 py-3 rounded-lg hover:bg-[#8B5C2B] text-sm md:text-base w-full sm:w-auto">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobView;