"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

type T = {
  title: string;
  description: string;
  category: string;
  link: string;
  pitch: string;
};

export const createPitch = async (formValues: T) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      error: "Unauthorized",
      status: "ERROR",
    });

  const { title, description, category, link, pitch } = formValues;

  const slug = slugify(title as string, { lower: true, strict: true });

  console.log("Session object:", session);

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      pitch,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
    };

    const result = await writeClient.create({
      _type: "startup",
      ...startup,
    });

    return parseServerActionResponse({
      ...result,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
