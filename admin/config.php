<?php
session_start();

// Логин и пароль для админки (поменяйте перед деплоем!)
define('ADMIN_LOGIN', 'admin');
define('ADMIN_PASSWORD', 'uniplant2024');

// Пути
define('DATA_DIR', __DIR__ . '/../data/');
define('UPLOADS_DIR', __DIR__ . '/../uploads/');
define('NEWS_FILE', DATA_DIR . 'news.json');

// Создаём папки и файлы если не существуют
if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!is_dir(UPLOADS_DIR)) mkdir(UPLOADS_DIR, 0755, true);
if (!file_exists(NEWS_FILE)) file_put_contents(NEWS_FILE, json_encode([], JSON_UNESCAPED_UNICODE));

// Функции работы с новостями
function getNews() {
    $data = file_get_contents(NEWS_FILE);
    return json_decode($data, true) ?: [];
}

function saveNews($news) {
    file_put_contents(NEWS_FILE, json_encode($news, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function generateId() {
    return uniqid('news_');
}

function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

// Загрузка изображения
function uploadImage($file, $subfolder = '') {
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) return false;
    if ($file['size'] > 10 * 1024 * 1024) return false; // max 10MB

    $dir = UPLOADS_DIR;
    if ($subfolder) {
        $dir .= $subfolder . '/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
    }

    $filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
    $filepath = $dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return ($subfolder ? $subfolder . '/' : '') . $filename;
    }
    return false;
}
