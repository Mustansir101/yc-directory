import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUPS_QUERY_BY_ID,
} from "@/sanity/lib/queries";
import Link from "next/link";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard from "@/components/StartupCard";
import { StartupTypeCard } from "../../page";

const md = markdownit();
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // parallel data fetching, to save time, since independent queries
  const [post, { select: editorPicks }] = await Promise.all([
    client.fetch(STARTUPS_QUERY_BY_ID, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);

  const parsedContent = md.render(post.pitch || "");

  if (!post) {
    return (
      <div>
        <p>No results found</p>
      </div>
    );
  }
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <div className="w-full flex justify-center">
          <img
            src={post.image}
            alt="thumbnail"
            className="w-2xl h-auto rounded-xl"
          />
        </div>
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5 ">
            <Link
              href={`/user/${post.author._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <img
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-light text-gray-700">
                  @{post.author.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="markdown-body max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {editorPicks?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPicks.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;
