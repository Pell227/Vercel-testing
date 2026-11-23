"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

function PostDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(async (res) => {
      if (res.status === 404) {
        router.push("/not-found");
      } else {
        const data: Post = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      }
    });
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const updatedPost: Post = await res.json();
      setPost(updatedPost);
      setIsEditing(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <h1>Edit Post</h1>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle(post.title);
                setContent(post.content);
                setIsEditing(false);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p className="text-muted">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("id-ID")
              : ""}
          </p>
          <p>{post.content}</p>
          <div className="d-flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-warning"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default function PostDetail() {
  return (
    <Suspense fallback={<p className="container mt-4">Loading...</p>}>
      <PostDetailContent />
    </Suspense>
  );
}
