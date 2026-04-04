const API_URL = 'http://localhost:8000';

document.getElementById('queryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const query = document.getElementById('queryInput').value.trim();
    if (!query) return;
    
    // Show loading, hide others
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Verifying...';
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error(await response.text());
        }
        
        const data = await response.json();
        
        // Display results
        document.getElementById('answer').textContent = data.answer;
        document.getElementById('confidence').innerHTML = `
            <strong>Overall Confidence: ${Math.round(data.overall_confidence * 100)}%</strong>
            <br><small>${data.unverified_count} unverified citations</small>
        `;
        
        const citationsEl = document.getElementById('citations');
        citationsEl.innerHTML = data.citations.map(c => `
            <div class="citation ${c.verification.verified ? 'verified' : 'unverified'}">
                <div class="status ${c.verification.verified ? 'verified' : 'unverified'}">
                    ${c.verification.verified ? '✅ Verified' : '⚠️ Unverified'}
                    <span>${c.verification.score.toFixed(2)}</span>
                </div>
                <div><strong>${c.case_name}</strong> (${c.date})</div>
                <div><em>${c.canonical}</em> - ${c.court}</div>
            </div>
        `).join('');
        
        document.getElementById('results').classList.remove('hidden');
        
    } catch (error) {
        document.getElementById('error').textContent = `Error: ${error.message}`;
        document.getElementById('error').classList.remove('hidden');
    } finally {
        document.getElementById('loading').classList.add('hidden');
        button.textContent = originalText;
        button.disabled = false;
    }
});

