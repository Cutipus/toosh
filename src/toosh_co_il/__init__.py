from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html", title="Toosh")


@app.route("/focus/<path:text>")
def item_focus(text: str) -> str:
    return render_template("item-focus.html", image=text)


@app.route("/main-window")
def main_window() -> str:
    return render_template("main-window.html")
