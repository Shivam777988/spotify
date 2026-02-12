import { Outlet } from "react-router";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { useState } from "react";
import MainContent from "./components/mainContent";
import Footer from "./components/Footer";

export default function LayOut() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col spotify-sebg text-white overflow-hidden">
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header setVisible={setVisible} visible={visible} />
      </div>

      {/* Content below Header */}
      <div className="flex flex-1 overflow-hidden pt-20">
        
        {/* Sidebar or Open Button */}
        <div
          className={`${
            visible ? "w-64" : "w-16"
          } h-full transition-all duration-300 ease-in-out overflow-y-auto bg-black border-r border-gray-800`}
        >
          {visible ? (
            <Sidebar visible={visible} setVisible={setVisible} />
          ) : (
            <div className="p-2 flex justify-center items-start">
              <button
                onClick={() => setVisible(true)}
                className="bg-green-600 text-sm px-2 py-1 rounded hover:bg-green-700 transition"
              >
                ☰
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <MainContent className="flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out">
          <Outlet />
        </MainContent>
        <Footer/>
      </div>
    </div>
  );
}
