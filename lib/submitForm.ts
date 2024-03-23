export default async function submitForm(api_url: string, formData: any, close: () => void): Promise<void> {
  try {
    const data = formData.values;
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (response.ok) {
      close(); // Close the modal after successful submission
    } else {
      // Handle error response
      console.error("Failed to submit form:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to submit form:", error);
  }
}
