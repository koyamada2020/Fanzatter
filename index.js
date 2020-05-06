const tags = ['SM','アイドル','アナル','オナニー','おっぱい','外国人',
            '緊縛','ゲイ','コスプレ','熟女','女子校生','素人','スカトロ','痴漢',
            '盗撮','ニューハーフ','ぶっかけ','ぽっちゃり','レズ','ロリ','露出'];

// html読み込み時に呼び出される関数 キーワード一覧と人気キーワードを表示
function setTagList () {
    // divタグの要素を取得
    const tagListElm = document.querySelector('#tagList');
    // ulタグの要素を取得
    const ulElm = tagListElm.querySelector('ul');
    for (let tag of tags) {
        // liタグを生成
        const liElm = document.createElement('li');
        // liタグ内にテキストを入れる
        liElm.textContent = tag;
        // addTag関数を設定
        liElm.onclick = addTag;
        // 要素を入れ子にする <ul><li></li></ul>
        ulElm.appendChild(liElm);
    }

    // div id=ranking の要素を取得
    const rankDivElm = document.querySelector('#ranking');
    // liタグの要素を取得
    const rLiElms = rankDivElm.querySelectorAll('li');
    // liタグの要素一つずつ関数を設定
    for (let elm of rLiElms) {
        elm.onclick = addTag;
    }
}

// キーワード一覧のキーワードをクリック時に登録キーワードに追加する関数
function addTag () {
    // div id=selectedTagsの要素を取得
    const divElm = document.querySelector('#selectedTags');
    // ulタグの要素を取得
    const ulElm = divElm.querySelector('ul');
    // liタグの要素を取得
    const liElms = ulElm.querySelectorAll('li');
    
    if (liElms.length <= 0) {
        // liタグを生成
        const liElm = document.createElement('li');
        // liタグにクリックした要素のテキストを入れる
        liElm.textContent = this.textContent;
        // クリックすると自分自身を消す関数を設定
        liElm.onclick = deleteSelf;
        // <ul><li></li></ul>にする
        ulElm.appendChild(liElm);
    } else {
        // 検索用の配列
        const keywords = [];
        for (let elm of liElms) {
            // 配列に要素を追加
            keywords.push(elm.textContent);
        }
        // キーワードが重複してない場合追加
        if (keywords.indexOf(this.textContent) < 0) {
            // liタグを生成
            const liElm = document.createElement('li');
            // liタグにクリックした要素のテキストを入れる
            liElm.textContent = this.textContent;
            // クリックすると自分自身を消す関数を設定
            liElm.onclick = deleteSelf;
            // <ul><li></li></ul>にする
            ulElm.appendChild(liElm);
        }
    }
}

// タグリセットをクリック時に選択タグを全て削除する関数
function resetTag () {
    // ulタグの要素を取得
    const tlElm = document.querySelector('#tagList').children[1];
    // liタグのNodeListを取得
    const liNodeList = tlElm.querySelectorAll('input');
    // ulタグの要素を取得
    const slctTags = document.querySelector('#selectedTags').children[1];
    for (let i = 0; i < liNodeList.length; i++) {
        // 該当checkboxのチェックを外す
        liNodeList[i].checked = false;
    }
    // selectTagsに子要素が存在する間、子要素を削除し続ける。すべてのタグを削除
    while (slctTags.lastChild) {
        slctTags.removeChild(slctTags.lastChild);
    }
}

// タグクリックで自分自身を削除する関数
function deleteSelf () {
    // 自分自身を削除する
    this.parentNode.removeChild(this);
    // ulタグの要素を取得
    const tlElm = document.querySelector('#tagList').children[1];
    // liタグのNodeListを取得
    const liNodeList = tlElm.querySelectorAll('input');
    // クリックした要素のテキストとタグ一覧のテキストが一致したらチェックを外す
    for (let i = 0; i < liNodeList.length; i++) {
        if (this.textContent === liNodeList[i].value) {
            liNodeList[i].checked = false;
        }
    }
}

// 入力キーワードを登録する関数
function registKeyword () {
    // inputタグの要素を取得
    const inElm = document.querySelector('#inputWord');
    // 入力したキーワードを取得
    const word = inElm.value;
    // 入力が空文字でない場合の処理
    if (word !== "") {
        // 取得したワードを半角/全角スペース区切りで配列に格納
        const wordArr = word.split(/ |　/);
        console.log(wordArr.length);
        for (let i = 0; i < wordArr.length; i++) {
            // スペースが入っているか判定
            if ( wordArr[i] ) {
                // ulタグを取得
                const ulElm = document.querySelector('#selectedTags').children[1];
                // liタグを生成
                const liElm = document.createElement('li');
                // liタグに入力したキーワードを入れる
                liElm.textContent = wordArr[i];
                // 関数セット
                liElm.onclick = deleteSelf;
                // <ul><li></li></ul>にする
                ulElm.appendChild(liElm);
            }
        }
    }
    // テキストボックス内のキーワードを削除
    inElm.value = '';
}

// 指定Urlに登録タグをPOST
function sendTagToDb(url) {
    // タグの要素を取得
    const slctTagsElm = document.querySelector('#selectedTags');
    const liTagElms = slctTagsElm.querySelectorAll('li');
    // FormDataオブジェクトを作成
    const formData = new FormData();
    // 登録キーワードを取得してオブジェクトに加える
    for ( liTagElm of liTagElms) {
        formData.append('tag[]', liTagElm.innerText);
    }
    console.log(formData.getAll('tag[]'));

    // formDataをサーバーへPOST
    fetch('sendKeywordToDb.php',
        {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(response.ok) {
                return response.text();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .then((text) => {
            // console.log(text);
        })
        .catch((error) => console.log(error));
}

function generateRequestUrl (_keywords, _sort = 'date', _offset = 1) {
    // リクエストパラメータの設定
    const api_id = '****';
    const affiliate_id = '****';
    const site = 'FANZA';
    const service = 'digital';
    const floor = 'videoa';
    const hits = 100;
    const offset = _offset;
    const sort = _sort;
    const keyword = _keywords.join(' ');
    const output = 'json';

    url = 'https://api.dmm.com/affiliate/v3/ItemList?api_id=' + api_id + '&affiliate_id=' + 
        affiliate_id + '&site=' + site + '&service=' + service + '&floor=' + floor + '&hits=' + 
        hits + '&offset=' + offset + '&sort=' + sort + '&keyword=' + keyword + '&output=' + output;

    return url;
}

// jsonからランダムなオフセット値を返す
function generateRandomOffsetFromJson(json) {
    // キーワードの総ヒット件数を代入
    const total_count = json['result']['total_count'];
    // total_countを最大値としたランダムな値を取得
    const offset = Math.floor(Math.random() * total_count) + 1;
    return offset;
}

// jsonからimg要素を生成する
function createImgElementFromJson(json) {
    // divタグの要素を取得
    let rcElm = document.querySelector('#resultContainer');
    // 更新処理 要素を全て消すまでループ
    while(rcElm.lastChild) {
        rcElm.removeChild(rcElm.lastChild);
    }
    // nだけ要素を作成 apiの仕様上100件まで取得できる 数字が大きいほど読み込みしない、こちらのサーバーの設定が原因？
    const n = 100;
    for (let i = 0; i < n; i++) {
        // 商品ごとに情報を取得
        const item = json.result.items[i];
        // サンプル動画が存在しない場合は要素を生成しない
        if (typeof item.sampleMovieURL === 'undefined') {
            continue;
        }
        // 大きい画像を取得
        let imgL = item.imageURL['large'];
        // divタグを生成
        let itemElm = document.createElement('div');
        // クラス名をitem
        itemElm.className = 'item';
        // imgタグを生成
        let imgElm = document.createElement('img');
        // 表示する画像をsrcに代入
        imgElm.src = imgL;
        // 画像の幅を設定
        imgElm.width = 476;
        // 画像の高さを設定
        imgElm.height = 306;
        // クリックすると動画に変わる関数を設定
        imgElm.onclick = changeToMovie;
        // 要素を入れ子にする <div><div><img/></div></div>
        rcElm.appendChild(itemElm).appendChild(imgElm);
    }
}

function createImgElement(value) {
    // 商品情報の取得位置
    let offset = 1;
    // 表示順 date=新着 rank=人気
    let sort = value;
    // 登録タグからキーワードを取得
    const keyword = getKeyFromTag();

    // クリックしたボタンごとの条件分岐
    if (value === 'random') {
        sort = 'date';
    }

    // リクエストURL
    let requestUrl = generateRequestUrl(keyword, sort, offset);
    // 指定URLにGETリクエスト
    fetch(requestUrl)
        .then((response) => {
            if (response.ok) {
                // Jsonデータを取得
                return response.json();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .then((json) => {
            // ランダム検索が押された場合
            if (value === 'random') {
                // ランダムなオフセット値を代入
                offset = generateRandomOffsetFromJson(json);
                // ランダム検索用のUrl生成
                requestUrl = generateRequestUrl(keyword, sort, offset);
                fetch(requestUrl)
                    .then(response => {
                        if(response.ok) {
                            return response.json();
                        } else {
                            throw new Error(`${response.status} ${response.statusText}`);
                        }
                    })
                    .then(json => {
                        createImgElementFromJson(json);
                    });
            } else {
                // Jsonを基にimg要素の作成
                createImgElementFromJson(json);
            }
        })
        .catch((error) => {
            console.log(error)
        });
}

function getKeyFromTag() {
    const slctTags = document.querySelector('#selectedTags').children[1];
    const liTag = slctTags.getElementsByTagName('li');
    const keyword = [];
        for (let i = 0; i < liTag.length; i++) {
        // [apple orange banana] な感じで
        keyword.push(liTag[i].textContent);
    }
    return keyword;
}

function changeToMovie () {
    // divタグの要素を生成 class="item"
    const divElm = this.parentNode;
    // imgタグのsrc属性の値を取得
    const imgSrc = this.src;
    // 値から動画IDを抜き出す
    const itemId = imgSrc.split('/')[5];
    // imgタグの要素を削除
    divElm.removeChild(this);
    // iframeタグ要素を生成
    let ifElm = document.createElement('iframe');
    ifElm.src = 'https://www.dmm.co.jp/litevideo/-/part/=/cid=' + itemId + '/size=476_306/';
    ifElm.width = 476;
    ifElm.height = 306;
    ifElm.scrolling = 'no';
    ifElm.frameBorder = '0';
    // 全画面表示を可能にする
    ifElm.allowFullscreen = true;
    // iframeタグを追加
    divElm.appendChild(ifElm);
}
