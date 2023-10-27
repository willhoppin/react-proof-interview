import { Citation } from '../../app/page';

interface OutlineRequestData {
    thesis: string;
    assignment: string;
    writingLevel: string;
    wordCount: string;
    citations: Citation[];
    writingSample: string;
    instructions: string;
    userId: string;
    token: string;
    pdfs?: File[]; // Updated to allow file uploads as an array of File objects
}

interface OutlineResponse {
    text: string;
}

export async function fetchOutline(data: OutlineRequestData): Promise<string> {
    const url = "https://llm-apps-398115.uc.r.appspot.com/outline";

    const headers = {
        'Authorization': `Bearer ${data.token}`
        // Content-Type is not set manually as it needs to be auto-generated with a proper boundary
    };

    // Use FormData to construct the body of the request
    const formData = new FormData();
    formData.append('thesis', data.thesis);
    formData.append('assignment', data.assignment);
    formData.append('writing_sample', data.writingSample);
    formData.append('citations', JSON.stringify(data.citations));  // Convert the citations array to a JSON string
    formData.append('writing_level', data.writingLevel);
    formData.append('word_count', data.wordCount);
    formData.append('instructions', data.instructions);
    formData.append('user_id', data.userId);

    // Append files to FormData if available
    if (data.pdfs) {
        Array.from(data.pdfs).forEach((file, index) => {
            formData.append('pdfs', file); // Append each file to the FormData instance
        });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData // Updated to use FormData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json() as OutlineResponse;
        return responseData.text;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
