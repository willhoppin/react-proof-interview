interface EssayRequestData {
    assignment: string;
    thesis: string;
    writingLevel: string;
    wordCount: string;
    instructions: string;
    writingSample?: string;
    outline: string;
    userId: string;
    token: string;
}

interface EssayResponse {
    text: string;
}

export async function fetchEssay(data: EssayRequestData): Promise<string> {
    const url = "https://llm-apps-398115.uc.r.appspot.com/essay";
    
    const headers = {
        'Authorization': `Bearer ${data.token}`,
        'Content-Type': 'application/json'
    };

    const body = {
        assignment: data.assignment,
        thesis: data.thesis,
        writing_level: data.writingLevel,
        word_count: data.wordCount,
        instructions: data.instructions,
        writing_sample: data.writingSample,
        outline: data.outline,
        user_id: data.userId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json() as EssayResponse;
        return responseData.text;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
