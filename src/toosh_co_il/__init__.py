from typing import assert_never
from flask import Flask, abort, render_template
import json
import pathlib

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


@app.route("/project/<project_title>")
def item_focus(project_title: str) -> str:
    if project_title not in all_projects:
        abort(404, "I didn't work on any project like that")

    assert app.static_folder is not None
    project_dir = pathlib.Path(app.static_folder) / "projects" / project_title
    assert project_dir.is_dir()
    metadata_path = project_dir / "metadata.json"
    assert metadata_path.is_file()
    with open(metadata_path) as metadata_json_file:
        metadata = json.load(metadata_json_file)

    match metadata:
        case {"title": str(), "subtitle": str(), "description": list(ps)} if all(isinstance(p, str) for p in ps):  # type: ignore
            print("Metadata normative")
        case anything_else:
            assert_never(anything_else)

    return render_template(
        "item-focus.html",
        title=metadata["title"],
        subtitle=metadata["subtitle"],
        paragraphs=metadata["description"],
        project=project_title,
    )


@app.route("/main-window")
def main_window() -> str:
    return render_template("main-window.html")


@app.route("/test")
def test_window() -> str:
    return render_template("test.html")
