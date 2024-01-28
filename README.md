# skramm_LineBot

## 概要

ソーシャル・イノベーションチャレンジ2023( https://www.oit.ac.jp/is/msl/soichalle/ )で開発した成果物のうち、LINE Botのプログラム

## 説明

Node.jsを用いて実装したLINE Botのプログラム

Beaconイベントとメッセージイベントを受け取り、それぞれに対応した処理を行う

## 使い方

- docker image
    - https://hub.docker.com/repository/docker/dodaidodai/skramm-line-bot/general

- cloud runで実行
    - コンテナイメージのurlを指定してデプロイ
    - 環境変数にLINE Botのチャンネルシークレットとチャンネルアクセストークンを設定
    - ポート番号は3000

node.jsが動く環境であれば、どこでも動くはず