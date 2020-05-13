<?php
require_once('database.php');
require_once('encode.php');

// キーワードを格納する配列
$keyword = [];

try {
    // データベースを初期化
    $db = initDatabase();
    // カウントを降順でキーワードを取得
    $values = $db->query('SELECT keyword FROM ranking ORDER BY count DESC');
    // fetchできなくなるまで代入
    while ($value = $values->fetch()) {
        $keyword[] = $value['keyword'];
    }
} catch(PDOException $e) {
    print "エラーメッセージ：{$e->getMessage()}";
}

?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <!-- Required meta tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Fanzatter</title>
    <script src="index.js"></script>
</head>
<body class="my-body" onload="setTagList();">
<h1 style="text-align:center;">Fanzatter</h1>
<div class="my-container container-fluid">
    <div id="searchContainer">
        <div id="ranking">
            <h4 id="popularTag">人気タグ</h4>
            <ul class="list-inline">
                <?php for ($i = 0; $i < 10; $i++) {
                    // @エラー無視
                    if (@$keyword[$i]) {
                        echo '<li class="list-inline-item btn btn-primary">' . e($keyword[$i]) . '</li>';
                    } else {
                        echo '<li class="list-inline-item btn btn-primary">未登録</li>';
                    }
                }
                ?>
            </ul>
        </div>
        <div id="tagList">
            <h4>タグ一覧</h4>
            <ul class="list-inline"></ul>
        </div>
        <div id="inputWordBox">
            <div class="input-group mb-2">
                <input id="inputWord" type="text" size="30" maxlength="30" class="form-control" placeholder="検索するキーワードを入力してください">
                <div class="input-group-append">
                    <button id="registBtn" type="button" class="btn btn-outline-secondary" value="regist" onclick="registKeyword()">タグ登録</button>
                </div>
            </div>
        </div>
        <div id="selectedTags">
            <ul class="list-inline"></ul>
        </div>
        <div id="searchButtons">
            <button id="newButton" class="btn btn-outline-dark" value="date" onclick="createImgElement(this.value);sendTagToDb()">新着検索</button>
            <button id="popButton" class="btn btn-outline-dark" value="rank" onclick="createImgElement(this.value);sendTagToDb()">人気検索</button>
            <button id="historyButton" class="btn btn-outline-dark" value="random" onclick="createImgElement(this.value);sendTagToDb()">ランダム検索</button>
            <button id="resetTag" class="btn btn-outline-dark" onclick="resetTag()">タグをリセット</button>
        </div>
    </div>
    <div class="tyuuigaki">
        <p>*画像クリックで動画を表示</p>
        <p>*動画内のアイコンで全画面表示</p>
    </div>
    <div id="resultContainer">
    </div>
</div>
<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
</body>
</html>