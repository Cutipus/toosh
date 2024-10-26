from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html", title="Toosh")


@app.route("/item-focus")
def item_focus() -> str:
    item = request.args.get("item")
    info = "a nice and big pic"
    return render_template("item-focus.html", item=item, info=info)


@app.route("/main-window")
def main_window() -> str:
    return render_template("main-window.html")
