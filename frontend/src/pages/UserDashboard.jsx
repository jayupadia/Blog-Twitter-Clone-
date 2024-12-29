import { useState } from 'react';
import JoditEditor from 'jodit-react';
import { editProfile, createBlog, searchProfiles, searchBlogs } from '../services/api';

const UserDashboard = () => {
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [blogContent, setBlogContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await editProfile(token, profile);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleBlogSubmit = async () => {
        try {
            await createBlog(token, { content: blogContent });
            alert('Blog created successfully');
            setBlogContent('');
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const profiles = await searchProfiles(token, searchQuery);
            const blogs = await searchBlogs(token, searchQuery);
            setSearchResults([...profiles, ...blogs]);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">User Dashboard</h1>
            
            {/* Edit Profile */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl mb-4 text-gray-700">Edit Profile</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-lg">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </form>
            </div>

            {/* Create Blog */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl mb-4 text-gray-700">Create Blog</h2>
                <JoditEditor
                    value={blogContent}
                    onChange={newContent => setBlogContent(newContent)}
                />
                <button onClick={handleBlogSubmit} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                    Submit Blog
                </button>
            </div>

            {/* Search Profiles and Blogs */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl mb-4 text-gray-700">Search Profiles and Blogs</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full p-2 border rounded mb-4"
                />
                <button onClick={handleSearch} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700">
                    Search
                </button>
                <ul className="mt-4 space-y-2">
                    {searchResults.map((result, index) => (
                        <li key={index} className="text-lg">
                            {result.name || result.title}: {result.email || result.content}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
