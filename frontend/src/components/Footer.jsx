import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return(
    <footer className="w-full bg-gray-100 border-t-2 border-gray-200 shadow-2xs-gray text-gray-800 py-6 mb-0">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-5">
        
        {/* Left Side - Platform Info */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-bold">GATEPrep</h2>
          <p className="text-sm opacity-80">© 2025 All rights reserved.</p>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/about" className="hovertext-blackk">About</a>
          <a href="/contact" className="hover:text-black">Contact</a>
          <a href="/terms" className="hover:text-black">Terms</a>
          <a href="/privacy" className="hover:text-black">Privacy Policy</a>
        </div>

        {/* Right Side - Social Media Links */}
        <div className="flex space-x-5 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-xl hover:text-blue-500" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl hover:text-blue-300" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl hover:text-pink-600" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-xl hover:text-red-600" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
