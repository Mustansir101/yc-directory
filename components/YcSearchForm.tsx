import Form from "next/form";
import React from "react";
import { Search } from "lucide-react";
import YcSearchFormReset from "./YcSearchFormReset";

const YcSearchForm = ({ query }: { query: string }) => {
  return (
    <Form action="/yc" scroll={false} className="yc-search-form search-form">
      <input
        type="text"
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search YC startups..."
      />

      <div className="flex gap-2">{query && <YcSearchFormReset />}</div>

      <button className="search-btn text-white">
        <Search className="size-5.5" />
      </button>
    </Form>
  );
};

export default YcSearchForm;
