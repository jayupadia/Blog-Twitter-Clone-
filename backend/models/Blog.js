const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            replies: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                    reply: { type: String },
                }
            ]
        }
    ]
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
