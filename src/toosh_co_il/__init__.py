import os
import mimetypes
from flask import Flask, abort, render_template, send_from_directory
import PIL.Image
import pathlib

mimetypes.add_type("image/webp", ".webp")

app = Flask(__name__)


def load_gallery() -> dict[str, tuple[int, int]]:
    assert app.static_folder is not None
    static_dir = pathlib.Path(app.static_folder)
    projects_dir = static_dir / "projects"
    assert projects_dir.is_dir()
    projects: dict[str, tuple[int, int]] = {}  # projectname -> (dimx, dimy)
    for project_path in projects_dir.iterdir():
        assert project_path.is_dir()
        assert (project_path / "fullsize.webp").is_file()
        assert (project_path / "preview.webp").is_file()
        with PIL.Image.open(project_path / "preview.webp") as preview_file:
            projects[project_path.name] = preview_file.width, preview_file.height
    return projects


projects_data = load_gallery()

columns: list[list[str]] = [
    ["juice", "maskit", "pocahontas2"],
    ["pocahontas", "good-morning", "hibbuk1", "alefbeitgimel"],
    ["golden-margarita-bw", "smoke", "lifta"],
    ["sunshine", "goodgood", "hibbuk2", "pigumim"],
]
for col in columns:
    for project_name in col:
        assert project_name in projects_data, f"project {project_name} declared but not actually in filesystem"

columns_with_dimensions = [[(name, projects_data[name]) for name in col] for col in columns]


@app.route("/")
def index() -> str:
    return render_template("base.html.j2", title="Toosh", page="index.html.j2", columns=columns_with_dimensions)


@app.route("/fragments/index")
def index_fragment() -> str:
    return render_template("index.html.j2", columns=columns_with_dimensions)


@app.route("/fragments/image-modal/<project_name>")
def image_modal_fragment(project_name: str):
    project_name = project_name.lower()
    if project_name not in projects_data:
        abort(404)

    return render_template("image-modal-fragment.html.j2", project_name=project_name, size=projects_data[project_name])


@app.route("/projects")
def projects():
    return render_template("base.html.j2", title="Projects", page="index-projects.html.j2")


@app.route("/test/")
def test_window() -> str:
    return render_template("test.html.j2", project_name="alefbeitgimel")


@app.route("/fragments/test/<testcase>")
def test_fragment(testcase: str) -> str:
    return render_template("test-fragment.html.j2", project_name=testcase)


@app.route("/test/<testcase>")
def test_case(testcase: str) -> str:
    return render_template("test.html.j2", project_name=testcase)


@app.route("/transtest")
def transtest():
    return render_template(
        "base.html.j2",
        page="transition-test.html.j2",
    )


@app.route("/transtest-end")
def transtest_end():
    return render_template(
        "base.html.j2",
        page="transition-end.html.j2",
    )


@app.route("/fragments/transtest-end")
def transtest_end_fragment():
    return render_template("transition-end.html.j2")


@app.route("/modal")
def modal_test():
    return render_template("modal-test.html.j2")


@app.route("/modal-fragment")
def modal_frag():
    return render_template("modal-fragment.html.j2")
