export function logger(message, severity) {
    // serverityはログの重要度を表す文字列
    // serverity: INFO, WARNING, ERROR, CRITICAL
    // それ以外の文字列が入力された場合はINFOとして扱う
    if (severity !== "INFO" && severity !== "WARNING" && severity !== "ERROR" && severity !== "CRITICAL") {
        severity = "INFO";
    }
    else {
        severity = severity;
    }

    const entry = {
        severity: severity,
        message: message,
    };

    //messageがテキストかオブジェクトかで処理を分岐
    if (typeof message === "string") {
        console.log(JSON.stringify(entry));
    }
    else {
        console.log(JSON.stringify(entry));
    }
}