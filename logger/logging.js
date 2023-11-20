export function logger(message, severity) {
    // serverityはログの重要度を表す文字列
    // serverity: INFO, WARNING, ERROR, CRITICAL, DEBUG
    // それ以外の文字列が入力された場合はINFOとして扱う
    if (severity !== "INFO" && severity !== "WARNING" && severity !== "ERROR" && severity !== "CRITICAL" && severity !== "DEBUG") {
        severity = "INFO";
    }
    else {
        severity = severity;
    }

    const entry = {// ログの内容を表すオブジェクト
        severity: severity,
        message: message,
    };

    console.log(JSON.stringify(entry));// ここでログを出力
}