<?php
require_once 'config.php';
requireLogin();

$news = getNews();
$item = null;
$isEdit = false;

// Загружаем существующую новость для редактирования
if (isset($_GET['id'])) {
    $isEdit = true;
    foreach ($news as $n) {
        if ($n['id'] === $_GET['id']) {
            $item = $n;
            break;
        }
    }
    if (!$item) {
        header('Location: index.php');
        exit;
    }
}

// Сохранение
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? generateId();
    $gallery = json_decode($_POST['existing_gallery'] ?? '[]', true) ?: [];

    // Загрузка обложки
    $cover = $_POST['existing_cover'] ?? '';
    if (!empty($_FILES['cover']['name'])) {
        $uploaded = uploadImage($_FILES['cover']);
        if ($uploaded) $cover = $uploaded;
    }

    // Загрузка фото в галерею
    if (!empty($_FILES['gallery']['name'][0])) {
        foreach ($_FILES['gallery']['name'] as $i => $name) {
            if (empty($name)) continue;
            $file = [
                'name' => $_FILES['gallery']['name'][$i],
                'tmp_name' => $_FILES['gallery']['tmp_name'][$i],
                'size' => $_FILES['gallery']['size'][$i],
                'error' => $_FILES['gallery']['error'][$i],
            ];
            $uploaded = uploadImage($file, 'gallery');
            if ($uploaded) {
                $caption = $_POST['gallery_captions'][$i] ?? '';
                $gallery[] = ['file' => $uploaded, 'caption' => $caption];
            }
        }
    }

    // Удаление фото из галереи
    $deletePhotos = json_decode($_POST['delete_photos'] ?? '[]', true) ?: [];
    if (!empty($deletePhotos)) {
        $gallery = array_values(array_filter($gallery, function($photo) use ($deletePhotos) {
            return !in_array($photo['file'], $deletePhotos);
        }));
    }

    $entry = [
        'id' => $id,
        'title' => $_POST['title'] ?? '',
        'date' => $_POST['date'] ?? date('Y-m-d'),
        'date_display' => $_POST['date_display'] ?? '',
        'tag' => $_POST['tag'] ?? '',
        'description' => $_POST['description'] ?? '',
        'content' => $_POST['content'] ?? '',
        'cover' => $cover,
        'gallery' => $gallery,
    ];

    // Обновляем или добавляем
    $found = false;
    foreach ($news as &$n) {
        if ($n['id'] === $id) {
            $n = $entry;
            $found = true;
            break;
        }
    }
    unset($n);
    if (!$found) $news[] = $entry;

    saveNews($news);
    header('Location: index.php?msg=saved');
    exit;
}

$title = $item['title'] ?? '';
$date = $item['date'] ?? date('Y-m-d');
$dateDisplay = $item['date_display'] ?? '';
$tag = $item['tag'] ?? '';
$description = $item['description'] ?? '';
$content = $item['content'] ?? '';
$cover = $item['cover'] ?? '';
$gallery = $item['gallery'] ?? [];
$itemId = $item['id'] ?? '';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $isEdit ? 'Редактировать' : 'Добавить' ?> новость — Админка</title>
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
                <a href="index.php" class="admin-nav-link">Новости</a>
                <a href="../index.html" class="admin-nav-link" target="_blank">Открыть сайт</a>
                <a href="logout.php" class="admin-nav-link admin-nav-link--logout">Выйти</a>
            </nav>
        </aside>
        <main class="admin-main">
            <div class="admin-header">
                <h1><?= $isEdit ? 'Редактировать новость' : 'Новая новость' ?></h1>
                <a href="index.php" class="btn-admin btn-admin--secondary">← Назад</a>
            </div>

            <form method="POST" enctype="multipart/form-data" class="edit-form">
                <input type="hidden" name="id" value="<?= htmlspecialchars($itemId) ?>">
                <input type="hidden" name="existing_cover" value="<?= htmlspecialchars($cover) ?>">
                <input type="hidden" name="existing_gallery" value='<?= htmlspecialchars(json_encode($gallery, JSON_UNESCAPED_UNICODE)) ?>'>
                <input type="hidden" name="delete_photos" id="deletePhotos" value="[]">

                <div class="form-section">
                    <h2>Основная информация</h2>
                    <div class="form-group">
                        <label>Заголовок *</label>
                        <input type="text" name="title" value="<?= htmlspecialchars($title) ?>" required>
                    </div>
                    <div class="form-row-admin">
                        <div class="form-group">
                            <label>Дата</label>
                            <input type="date" name="date" value="<?= htmlspecialchars($date) ?>">
                        </div>
                        <div class="form-group">
                            <label>Отображаемая дата</label>
                            <input type="text" name="date_display" value="<?= htmlspecialchars($dateDisplay) ?>" placeholder="напр. Октябрь 2025">
                        </div>
                        <div class="form-group">
                            <label>Тег</label>
                            <input type="text" name="tag" value="<?= htmlspecialchars($tag) ?>" placeholder="напр. Продукты">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Краткое описание</label>
                        <textarea name="description" rows="3" placeholder="Для карточки на странице новостей"><?= htmlspecialchars($description) ?></textarea>
                    </div>
                    <div class="form-group">
                        <label>Полный текст статьи (HTML)</label>
                        <textarea name="content" rows="12" placeholder="Поддерживается HTML: <h2>, <p>, <ul>, <li> и т.д."><?= htmlspecialchars($content) ?></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h2>Обложка</h2>
                    <?php if ($cover): ?>
                        <div class="current-cover">
                            <img src="../uploads/<?= htmlspecialchars($cover) ?>" alt="">
                            <p>Текущая обложка. Загрузите новую чтобы заменить.</p>
                        </div>
                    <?php endif; ?>
                    <div class="form-group">
                        <input type="file" name="cover" accept="image/*">
                    </div>
                </div>

                <div class="form-section">
                    <h2>Фотогалерея</h2>

                    <?php if (!empty($gallery)): ?>
                        <div class="gallery-grid" id="galleryGrid">
                            <?php foreach ($gallery as $photo): ?>
                                <div class="gallery-item" data-file="<?= htmlspecialchars($photo['file']) ?>">
                                    <img src="../uploads/<?= htmlspecialchars($photo['file']) ?>" alt="">
                                    <p><?= htmlspecialchars($photo['caption'] ?? '') ?></p>
                                    <button type="button" class="btn-remove-photo" onclick="removePhoto(this)">&times;</button>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <div class="form-group">
                        <label>Добавить фотографии</label>
                        <input type="file" name="gallery[]" accept="image/*" multiple>
                        <small>Можно выбрать несколько файлов</small>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-admin btn-admin--primary btn-admin--lg">Сохранить новость</button>
                    <a href="index.php" class="btn-admin btn-admin--secondary">Отмена</a>
                </div>
            </form>
        </main>
    </div>

    <script>
    const deleteList = [];
    function removePhoto(btn) {
        const item = btn.closest('.gallery-item');
        const file = item.dataset.file;
        deleteList.push(file);
        document.getElementById('deletePhotos').value = JSON.stringify(deleteList);
        item.style.opacity = '0.3';
        item.style.pointerEvents = 'none';
        btn.textContent = 'Удалено';
    }
    </script>
</body>
</html>
