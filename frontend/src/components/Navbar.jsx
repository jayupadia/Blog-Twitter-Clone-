import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link to="/">MyBlog</Link> {/* Use Link instead of a tag */}
          </div>

          {/* Centered Links */}
          <div className="space-x-6">
            <Link to="/" className="hover:text-blue-400 transition-colors duration-200">Home</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">Contact Us</Link>
            <Link to="/blogs" className="hover:text-blue-400 transition-colors duration-200">Blogs</Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors duration-200">About Us</Link>
          </div>

          {/* Login and Sign Up */}
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 transition-colors duration-200">Login</Link>
            <Link to="/signup" className="px-4 py-2 border border-blue-500 rounded hover:bg-blue-500 transition-colors duration-200">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
