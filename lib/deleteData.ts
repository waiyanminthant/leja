export default async function deleteData(
  api_url: string,
  detail: string
): Promise<void> {
  alert(`Are you sure you want to delete ${detail} expesne?`);

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
