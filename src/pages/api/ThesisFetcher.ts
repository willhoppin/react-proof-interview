import { Citation } from '../../app/page';

interface ThesisRequestData {
  assignment: string;
  writingLevel: string;
  wordCount: string;
  writingSample: string;
  citations: Citation[];
  instructions: string;
  userId: string;
  token: string;
  pdfs?: File[];  // Include the optional pdfs property
}

interface ThesisResponse {
  text: string;
}

export async function fetchThesis(data: ThesisRequestData): Promise<string> {
  const url = "http://127.0.0.1:5000/thesis";

  const headers = {
    'Authorization': `Bearer ${data.token}`
    // 'Content-Type': 'application/json'  <-- remove this line since we're using FormData and the browser will auto-set it
  };

  // Using FormData to construct the body of the request
  const formData = new FormData();
  formData.append('assignment', data.assignment);
  formData.append('writing_level', data.writingLevel);
  formData.append('word_count', data.wordCount);
  formData.append('writing_sample', data.writingSample);
  formData.append('citations', JSON.stringify(data.citations));  // Convert the citations array to a JSON string
  formData.append('instructions', data.instructions);
  formData.append('user_id', data.userId);

  // Append files to formData if available
  if (data.pdfs) {
      Array.from(data.pdfs).forEach((file) => {
          formData.append('pdfs', file);  // Append each file to formData
      });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData  // Use formData as the body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json() as ThesisResponse;
    return responseData.text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
