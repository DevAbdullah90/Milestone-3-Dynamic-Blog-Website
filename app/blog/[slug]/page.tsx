"use client";
import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// Define the interface for the blog object
interface Blog {
  name: string;
  subheading: string;
  image: any; // Replace `any` with the correct type if available
  description: string;
  detail: string;
}

const BlogPost = () => {
  const { slug } = useParams(); // Extract slug from URL
  const [blog, setBlog] = useState<Blog | null>(null); // Use the Blog interface
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    if (!slug || Array.isArray(slug)) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const fetchedBlog = await client.fetch(
          `*[_type == "blog" && slug.current == $slug][0]`,
          { slug }
        );
        setBlog(fetchedBlog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments((prevComments) => [...prevComments, newComment.trim()]);
      setNewComment("");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900">Blog Not Found</h1>
        <p className="text-gray-700 mt-4">
          The blog you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.name}</h1>
        <p className="text-gray-700 text-2xl mb-4">{blog.subheading}</p>
        {blog.image && (
          <img
            src={urlFor(blog.image).url()}
            alt={blog.name || "Blog Image"}
            className="w-full h-auto mb-6"
          />
        )}
        <p className="text-gray-700 text-base mb-4">{blog.description}</p>
        <p className="text-gray-700 text-base mb-4">{blog.detail}</p>
        {/* Read More Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-green-400 rounded-2xl sm:w-auto sm:mb-0"
        >
          Go Back
          <svg
            className="w-4 h-4 ml-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg"
                >
                  <p className="text-gray-800">{comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">We want to know your thoughts about this blog!!</p>
            )}
          </div>
          {/* Add Comment Input */}
          <div className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleAddComment}
              className="mt-3 px-6 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
