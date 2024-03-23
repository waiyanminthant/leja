export default async function deleteData(
  api_url: string,
): Promise<void> {
  try {
    const response = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Handle error response
      console.error("Failed to delete data:", response.statusText);
    }

    window.location.reload();
  } catch (error) {
    console.error("Failed to delete data:", error);
  }
}
