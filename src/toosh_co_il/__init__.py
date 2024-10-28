from flask import Flask, abort, render_template

app = Flask(__name__)

gallery_format: list[list[str]] = [
    ["juice", "maskit", "pocahontas2"],
    ["pocahontas", "good-morning", "hibbuk1", "alefbeitgimel"],
    ["golden-margarita-bw", "smoke", "lifta"],
    ["sunshine", "goodgood", "hibbuk2", "pigumim"],
]

all_projects = {project for col in gallery_format for project in col}


@app.route("/")
def index() -> str:
    return render_template("index.html", title="Toosh", columns=gallery_format)


@app.route("/project/<path:project_title>")
def item_focus(project_title: str) -> str:
    if project_title not in all_projects:
        abort(404, "I didn't work on any project like that")
    return render_template("item-focus.html", project=project_title)


@app.route("/main-window")
def main_window() -> str:
    return render_template("main-window.html")


@app.route("/test")
def test_window() -> str:
    return render_template("test.html")
