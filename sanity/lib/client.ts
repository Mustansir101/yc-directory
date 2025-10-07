import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
// useCdn : true, will cache the data for 1 minute, and then revalidate
// useCdn : false, will always fetch the latest data
