import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";
// every page has access to search params
// we use that instead of states to keep this page server rendered

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const posts = [
    {
      _id: "1",
      _createdAt: "2024-06-10T12:00:00Z",
      views: 150,
      author: { _id: "1", name: "Alice" },
      description: "This is a sample post description.",
      image:
        "https://images.unsplash.com/photo-1634912314704-c646c586b131?q=80&w=294&auto=format&fit=crop&ixlib=rb-4.0",
      category: "Robots",
      title: "We Robots",
    },
  ];

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup, <br /> connect with entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search Results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts.length > 0 ? (
            posts.map((post, index) => <StartupCard post={post} />)
          ) : (
            <p className="no-result">No results found</p>
          )}
        </ul>
      </section>
    </>
  );
}
