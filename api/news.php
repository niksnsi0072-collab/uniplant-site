<?php
// API для получения новостей на фронтенде
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$newsFile = __DIR__ . '/../data/news.json';

if (!file_exists($newsFile)) {
    echo json_encode([]);
    exit;
}

$news = json_decode(file_get_contents($newsFile), true) ?: [];

// Сортировка: новые сверху
usort($news, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));

// Параметр ?id=xxx для одной новости
if (isset($_GET['id'])) {
    foreach ($news as $item) {
        if ($item['id'] === $_GET['id']) {
            echo json_encode($item, JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

// Лимит
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
if ($limit > 0) $news = array_slice($news, 0, $limit);

echo json_encode($news, JSON_UNESCAPED_UNICODE);
