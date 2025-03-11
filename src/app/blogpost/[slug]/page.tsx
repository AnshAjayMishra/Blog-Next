import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the proper params type according to Next.js App Router
export interface BlogPostParams {
  slug: string;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: BlogPostParams | Promise<BlogPostParams>;
}): Promise<Metadata> {
  // Await params if it's a Promise
  const resolvedParams = await Promise.resolve(params);

  const postPath = path.join(
    process.cwd(),
    "src/app/blogpost/content",
    `${resolvedParams.slug}.md`
  );

  try {
    const fileContent = fs.readFileSync(postPath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: data.title,
      description: data.description,
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    return {
      title: "Post Not Found",
      description: "The requested blog post does not exist.",
    };
  }
}

// Generate static paths for all blog posts
export async function generateStaticParams(): Promise<BlogPostParams[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "src/app/blogpost/content");
    if (!fs.existsSync(postsDirectory)) return [];

    const files = fs.readdirSync(postsDirectory);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        slug: file.replace(/\.md$/, ""),
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Main page component
export default async function Page({
  params,
}: {
  params: BlogPostParams | Promise<BlogPostParams>;
}) {
  // Await params if it's a Promise
  const resolvedParams = await Promise.resolve(params);

  const postPath = path.join(
    process.cwd(),
    "src/app/blogpost/content",
    `${resolvedParams.slug}.md`
  );

  try {
    if (!fs.existsSync(postPath)) return notFound();

    // Read Markdown file
    const fileContent = fs.readFileSync(postPath, "utf-8");
    const { data, content } = matter(fileContent);

    // Convert Markdown to HTML
      const processor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: "vesper",
        transformers: [
          transformerCopyButton({
            visibility: "always",
            feedbackDuration: 3000,
          }),
        ],
      })
      .use(rehypeStringify);

    const htmlContent = (await processor.process(content)).toString();

    return (
      <>
     <Link href='/' className="max-w-3xl mx-auto flex items-center justify-baseline">
  <Button 
    variant="outline" 
    className="bg-white dark:bg-[#080808] text-black dark:text-white rounded-xl absolute top-0 mt-3"
  >
    ←
  </Button>
</Link>

        <div className="max-w-3xl mx-auto mt-12 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            {data.title}
          </h1>

          <div className="text-gray-500 dark:text-gray-300 mt-2 flex justify-between text-sm">
            <span>By {data.author || "Unknown"}</span>
            <span>{data.date || "Unknown Date"}</span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mt-4">
            {data.description}
          </p>

          {/* Apply Tailwind Typography styles with proper width */}
          <article className="prose prose-md dark:prose-invert mt-6 w-full max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </article>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error reading file:", error);
    return notFound();
  }
}
