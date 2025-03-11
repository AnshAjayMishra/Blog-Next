import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogCards() {
    const blogs = [
      {
        title: "Understanding React Hooks",
        description: "A deep dive into the world of React Hooks and how they simplify state management in functional components.",
        author: "John Doe",
        date: "March 11, 2025",
        slug: "understanding-react-hooks"
      },
      {
        title: "Mastering JavaScript Closures",
        description: "A guide to understanding closures in JavaScript and their practical applications.",
        author: "Jane Smith",
        date: "March 10, 2025",
        slug: "mastering-javascript-closures"
      },
      {
        title: "CSS Grid vs Flexbox",
        description: "Comparing CSS Grid and Flexbox for modern web layout design and when to use each.",
        author: "Alex Johnson",
        date: "March 9, 2025",
        slug: "css-grid-vs-flexbox"
      }
    ];
  
    return (
      <div className="min-h-screen p-6 flex justify-center">
        <div className="max-w-3xl w-full">
          
          <h1 className="text-3xl font-bold  mb-6">Blogs</h1>
          <div className="space-y-4">
            {blogs.map((blog, index) => (
              <div key={index} className=" p-5 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-900">
                <h2 className="text-xl font-semibold ">{blog.title}</h2>
                <p className=" mt-2">{blog.description}</p>
                <div className="mt-4 text-sm ">By {blog.author} • {blog.date}</div>
                
                <Link href={`/blogpost/${blog.slug}`}>
                  <Button variant="outline" className=" hover:bg-zinc-600 dark:hover:bg-zinc-400 mt-4 bg-black dark:bg-white text-white dark:text-black">Click here</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
