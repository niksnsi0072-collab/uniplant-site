<?php
require_once 'config.php';
requireLogin();

$news = getNews();

// Удаление новости
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $news = array_filter($news, fn($n) => $n['id'] !== $id);
    $news = array_values($news);
    saveNews($news);
    header('Location: index.php?msg=deleted');
    exit;
}

// Сортировка: новые сверху
usort($news, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Новости — Админка</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <div class="admin-logo">
                <img src="../img/logo-rus.png" alt="ЮниПлант">
            </div>
            <nav class="admin-nav">
                <a href="index.php" class="admin-nav-link active">Новости</a>
                <a href="../index.html" class="admin-nav-link" target="_blank">Открыть сайт</a>
                <a href="logout.php" class="admin-nav-link admin-nav-link--logout">Выйти</a>
            </nav>
        </aside>
        <main class="admin-main">
            <div class="admin-header">
                <h1>Новости</h1>
                <a href="edit.php" class="btn-admin btn-admin--primary">+ Добавить новость</a>
            </div>

            <?php if (isset($_GET['msg'])): ?>
                <div class="alert alert--success">
                    <?php
                    $msgs = ['saved' => 'Новость сохранена', 'deleted' => 'Новость удалена'];
                    echo $msgs[$_GET['msg']] ?? 'Готово';
                    ?>
                </div>
            <?php endif; ?>

            <?php if (empty($news)): ?>
                <div class="empty-state">
                    <p>Пока нет новостей</p>
                    <a href="edit.php" class="btn-admin btn-admin--primary">Добавить первую новость</a>
                </div>
            <?php else: ?>
                <div class="news-table">
                    <div class="news-table-header">
                        <span>Фото</span>
                        <span>Заголовок</span>
                        <span>Дата</span>
                        <span>Тег</span>
                        <span>Действия</span>
                    </div>
                    <?php foreach ($news as $item): ?>
                        <div class="news-table-row">
                            <div class="news-table-thumb">
                                <?php if (!empty($item['cover'])): ?>
                                    <img src="../uploads/<?= htmlspecialchars($item['cover']) ?>" alt="">
                                <?php else: ?>
                                    <div class="thumb-placeholder">—</div>
                                <?php endif; ?>
                            </div>
                            <div class="news-table-title">
                                <strong><?= htmlspecialchars($item['title']) ?></strong>
                                <?php if (!empty($item['gallery'])): ?>
                                    <small><?= count($item['gallery']) ?> фото</small>
                                <?php endif; ?>
                            </div>
                            <div class="news-table-date"><?= htmlspecialchars($item['date_display'] ?? $item['date']) ?></div>
                            <div class="news-table-tag">
                                <?php if (!empty($item['tag'])): ?>
                                    <span class="tag-badge"><?= htmlspecialchars($item['tag']) ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="news-table-actions">
                                <a href="edit.php?id=<?= $item['id'] ?>" class="btn-admin btn-admin--sm">Редактировать</a>
                                <a href="index.php?delete=<?= $item['id'] ?>" class="btn-admin btn-admin--sm btn-admin--danger" onclick="return confirm('Удалить новость?')">Удалить</a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </main>
    </div>
</body>
</html>
