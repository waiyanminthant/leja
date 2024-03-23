export default async function getData(url: string, desc: string, options?: string) {

  const res = await fetch(url, { next: { revalidate: 0 } });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Error! Failed to fetch ${desc} data.`);
  }

  return res.json();
}
