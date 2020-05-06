<?php
require_once('database.php');

// 送られてきたキーワードを代入
$keywords = $_POST['tag'];
var_dump($keywords);
// 配列の空チェック
if (!empty($keywords)) {
    foreach ($keywords as $keyword) {
        // 空白文字チェック
        if (isset($keyword)) {
            try {
                // データベースを初期化
                $db = initDatabase();
                // データベース内のキーワードを検索
                $stt = $db->prepare('SELECT * FROM ranking WHERE keyword = :keyword');
                // :keyword と $keywordをバインドする
                $stt->bindValue(':keyword', $keyword);
                // sql文実行
                $stt->execute();
                // 一致したキーワード数を取得
                $stt = $stt->fetch();
                // キーワードが存在しない場合
                if (!$stt) {
                    // キーワードを追加する
                    $insert = $db->prepare('INSERT INTO ranking SET keyword = :keyword');
                    $insert->bindValue(':keyword', $keyword);
                    $insert->execute();
                }
                // キーワードを＋１カウントする
                $plus = $db->prepare('UPDATE ranking SET count = count + 1 WHERE keyword = :keyword');
                $plus->bindValue(':keyword', $keyword);
                $plus->execute();
        
            } catch(PDOException $e) {
                print "エラーメッセージ：{$e->getMessage()}";
            }
        }
    }
}
