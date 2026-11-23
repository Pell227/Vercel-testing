import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

async function PostList() {
  await connection();
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  if (allPosts.length === 0) return <p>No posts yet.</p>;

  return (
    <ul className="list-group">
      {allPosts.map((post) => (
        <li key={post.id} className="list-group-item">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
          <span className="text-muted float-end">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("id-ID")
              : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>
      <Link href="/create" className="btn btn-primary mb-3">
        Create Post
      </Link>
      <Suspense fallback={<p>Loading posts...</p>}>
        <PostList />
      </Suspense>
    </main>
  );
}
