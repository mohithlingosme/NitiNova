<!DOCTYPE html>
<html>
<head>
    <title>Drafting - NitiNova</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <div class="container">
        <h1>AI Legal Drafting</h1>
        <form id="draftForm">
            <select id="template">
                <option>Writ Petition</option>
                <option>Legal Notice</option>
                <option>Agreement</option>
            </select>
            <textarea id="context" placeholder="Case details..."></textarea>
            <button type="submit">Generate Draft</button>
        </form>
        <div id="draftOutput"></div>
    </div>
    
    <script src="assets/js/drafting.js"></script>
    <?php include 'includes/footer.php'; ?>
</body>
</html>

