import {
  AssetRecordType,
  type TLAsset,
  type TLBookmarkAsset,
  getHashForString,
} from "tldraw";

// How does our server handle bookmark unfurling?
export async function getBookmarkPreview({
  url,
}: {
  url: string;
}): Promise<TLAsset> {
  // we start with an empty asset record
  const asset: TLBookmarkAsset = {
    id: AssetRecordType.createId(getHashForString(url)),
    typeName: "asset",
    type: "bookmark",
    meta: {},
    props: {
      src: url,
      description: "",
      image: "",
      favicon: "",
      title: "",
    },
  };

  try {
    // try to fetch the preview data from the server
    const response = await fetch(
      `${process.env.TLDRAW_WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();

    // fill in our asset with whatever info we found
    asset.props.description = data?.description ?? "";
    asset.props.image = data?.image ?? "";
    asset.props.favicon = data?.favicon ?? "";
    asset.props.title = data?.title ?? "";
  } catch (e) {
    console.error(e);
  }

  return asset;
}
