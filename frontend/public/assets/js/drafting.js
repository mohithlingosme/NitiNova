document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('draftForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const template = document.getElementById('template').value;
        const context = document.getElementById('context').value;
        
        const response = await fetch('/api/proxy.php/api/v1/drafting/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({template_type: template, case_details: {context}})
        });
        
        const draft = await response.json();
        document.getElementById('draftOutput').innerHTML = 
            `<pre>${draft.content}</pre><p>Confidence: ${draft.confidence}</p>`;
    });
});

