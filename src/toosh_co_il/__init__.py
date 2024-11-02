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


def load_gallery() -> list[str]:
    assert app.static_folder is not None
    static_dir = pathlib.Path(app.static_folder)
    projects_dir = static_dir / "projects"
    assert projects_dir.is_dir()

    projects: list[str] = []
    for project in projects_dir.iterdir():
        assert project.is_dir()
        assert (project / "metadata.json").is_file()
        assert (project / "preview.webp").is_file()
        projects.append(project.name)

    for column in gallery_format:
        for item in column:
            assert item in projects

    return projects


all_projects = load_gallery()
print(all_projects)


@app.route("/")
def index() -> str:
    return render_template("base.html.j2", title="Toosh", page="index.html.j2", columns=gallery_format)


@app.route("/project/<project_title>")
def item_focus(project_title: str) -> str:
    if project_title not in all_projects:
        abort(404, "I didn't work on any project like that")

    assert app.static_folder is not None
    project_dir = pathlib.Path(app.static_folder) / "projects" / project_title
    metadata_path = project_dir / "metadata.json"
    with open(metadata_path) as metadata_json_file:
        metadata = json.load(metadata_json_file)

    match metadata:
        case {"title": str(), "subtitle": str(), "description": list(ps)} if all(isinstance(p, str) for p in ps):  # type: ignore
            print("Metadata normative")
        case anything_else:
            assert_never(anything_else)

    return render_template(
        "base.html.j2",
        page="item-focus.html.j2",
        title=metadata["title"],
        subtitle=metadata["subtitle"],
        paragraphs=metadata["description"],
        project=project_title,
    )


@app.route("/fragments/index")
def index_fragment() -> str:
    return render_template("index.html.j2", columns=gallery_format)


@app.route("/fragments/item-focus/<project_name>")
def project_fragment(project_name: str) -> str:
    if project_name not in all_projects:
        abort(404, "I didn't work on any project like that")

    assert app.static_folder is not None
    project_dir = pathlib.Path(app.static_folder) / "projects" / project_name
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
        "item-focus.html.j2",
        title=metadata["title"],
        subtitle=metadata["subtitle"],
        paragraphs=metadata["description"],
        project=project_name,
    )


@app.route("/test/")
def test_window() -> str:
    return render_template("test.html.j2", project_name="alefbeitgimel")


@app.route("/fragments/test/<testcase>")
def test_fragment(testcase: str) -> str:
    return render_template("test-fragment.html.j2", project_name=testcase)


@app.route("/test/<testcase>")
def test_case(testcase: str) -> str:
    return render_template("test.html.j2", project_name=testcase)
