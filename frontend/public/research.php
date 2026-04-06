<!DOCTYPE html>
<html>
<head>
    <title>Legal Research - NitiNova</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <div class="container">
        <h1>Verified Legal Research</h1>
        <form id="researchForm">
            <input type="text" id="query" placeholder="Enter legal query (e.g. Article 21 right to privacy)">
            <select id="court">
                <option>Supreme Court</option>
                <option>High Court</option>
            </select>
            <button type="submit">Search</button>
        </form>
        <div id="results"></div>
    </div>
    
    <script src="assets/js/research.js"></script>
    <?php include 'includes/footer.php'; ?>
</body>
</html>

