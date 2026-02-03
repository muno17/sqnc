<?php
require_once 'db_config.php';

echo "<h2>SQNC Database Test</h2>";

try {
    // 1. Create a Unique Test User
    $tempName = "user_" . bin2hex(random_bytes(3));
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$tempName, 'pass123']);
    $userId = $pdo->lastInsertId();
    
    echo "✅ Created User: <strong>$tempName</strong> (ID: $userId)<br>";

    // 2. Build a Mock Pattern (64 steps of data)
    // This proves LONGTEXT can handle the bulk
    $mockSteps = [];
    for($i = 0; $i < 64; $i++) {
        $mockSteps[] = [
            "step" => $i,
            "active" => ($i % 4 == 0), // Triggers every 4th step
            "params" => ["vol" => 0.8, "pitch" => 1.0, "cutoff" => 1200]
        ];
    }

    $patternData = [
        "projectName" => "Terminal Test Beat",
        "bpm" => 120,
        "tracks" => [
            ["trackName" => "Kick", "data" => $mockSteps]
        ]
    ];
    $jsonString = json_encode($patternData);

    // 3. Insert into Patterns Table
    $stmt = $pdo->prepare("INSERT INTO patterns (user_id, name, bpm, content) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userId, $patternData['projectName'], $patternData['bpm'], $jsonString]);
    
    echo "✅ JSON Pattern saved to <strong>sqnc_db.patterns</strong><br>";

    // 4. Retrieve using a JOIN
    $sql = "SELECT users.username, patterns.name, patterns.content 
            FROM patterns 
            INNER JOIN users ON patterns.user_id = users.id 
            WHERE users.id = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $row = $stmt->fetch();

    echo "<h3>Result from JOIN Query:</h3>";
    echo "User: " . $row['username'] . "<br>";
    echo "Pattern: " . $row['name'] . "<br>";
    echo "Data Length: " . strlen($row['content']) . " characters.<br>";
    echo "✅ Success! Database and PHP are perfectly synced.";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>