<?php
// dbを初期化
function initDatabase() {
    $dsn = 'mysql:dbname=fanzatter;host=127.0.0.1;charset=utf8';
    $user = '****';
    $password = '****';
    // データベースへの接続を確立
    $db = new PDO($dsn, $user, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $db;
}