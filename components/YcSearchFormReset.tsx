"use client";

import { X } from "lucide-react";
import Link from "next/link";

const YcSearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector(".yc-search-form") as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <button type="reset" onClick={reset} className="search-btn text-white">
      <Link href="/yc">
        <X className="size-5" />
      </Link>
    </button>
  );
};

export default YcSearchFormReset;
