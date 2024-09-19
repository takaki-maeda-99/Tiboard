try {
    var auth_url = "{% url 'dash_board:auth' %}";
    var current_url = window.location.href;
    if (!current_url.includes("auth=")) {
        // nextパラメータをURLに追加してリダイレクト
        auth_url += "?next=" + encodeURIComponent(current_url);
        window.location.href = auth_url;
    }
} catch (error) {
    // エラーが発生した場合は、エラーメッセージをコンソールに表示
    console.error("Error:", error);
}