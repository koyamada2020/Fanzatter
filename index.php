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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fanzatter</title>
    <script src="index.js"></script>
</head>
<body onload="setTagList();">
<div id="wrap">
    <div id="searchContainer">
        <div id="ranking">
            <span>人気キーワード</span>
            <ul>
                <?php for ($i = 0; $i < 10; $i++) {
                    // @エラー無視
                    if (@$keyword[$i]) {
                        echo '<li>' . e($keyword[$i]) . '</li>';
                    } else {
                        echo "<li>未登録</li>";
                    }
                }
                ?>
            </ul>
        </div>
        <div id="tagList">
            <span>キーワード一覧</span>
            <ul></ul>
        </div>
        <div id="inputWordBox">
            <span>キーワード登録</span>
            <div>
                <input id="inputWord" type="text" size="30" maxlength="30">
                <button id="registBtn" value="regist" onclick="registKeyword()">登録</button>
            </div>
        </div>
        <div id="selectedTags">
            <span>登録キーワード</span>
            <ul></ul>
        </div>
        <div id="searchButtons">
            <button id="newButton" value="date" onclick="createImgElement(this.value);sendTagToDb()">新着検索</button>
            <button id="popButton" value="rank" onclick="createImgElement(this.value);sendTagToDb()">人気検索</button>
            <button id="historyButton" value="random" onclick="createImgElement(this.value);sendTagToDb()">ランダム検索</button>
            <button id="resetTag" onclick="resetTag()">タグをリセット</button>
        </div>
    </div>
    <div id="resultContainer"> 
    </div>
</div>
</body>
</html>