document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('researchForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const query = document.getElementById('query').value;
        const court = document.getElementById('court').value;
        
        try {
            const response = await fetch('/api/proxy.php/api/v1/research/search', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query, court})
            });
            
            const results = await response.json();
            displayResults(results);
        } catch (error) {
            console.error('Research error:', error);
        }
    });
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>${results.verified_citations || 0} Verified Results</h3>
        <ul>
            ${results.results?.map(r => `<li><strong>${r.citation}</strong>: ${r.summary}</li>`).join('') || ''}
        </ul>
    `;
}

