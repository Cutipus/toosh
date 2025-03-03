import mimetypes
from flask import Flask, abort, render_template
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
    ["crazaza", "golden-margarita-bw", "smoke", "lifta"],
    ["jeff-bright", "sunshine", "goodgood", "hibbuk2", "pigumim"],
]
for col in columns:
    for project_name in col:
        assert project_name in projects_data, f"project {project_name} declared but not actually in filesystem"

columns_with_dimensions = [[(name, projects_data[name]) for name in col] for col in columns]


# Standard Routes
@app.route("/")
def index_fullpage() -> str:
    return render_template("base.html.j2", title="Toosh", page="index.html.j2", columns=columns_with_dimensions)


@app.route("/fragments/index")
def index_fragment() -> str:
    return render_template("index.html.j2", columns=columns_with_dimensions)


@app.route("/fragments/image-focus/<project_name>")
def image_focus_fragment(project_name: str):
    project_name = project_name.lower()
    if project_name not in projects_data:
        abort(404)
    return render_template("image-focus.html.j2", project_name=project_name, size=projects_data[project_name])


@app.route("/image-focus/<project_name>")
def image_focus_fullpage(project_name: str):
    project_name = project_name.lower()
    if project_name not in projects_data:
        abort(404)
    return render_template(
        "base.html.j2",
        title="Toosh",
        page="image-focus.html.j2",
        project_name=project_name,
        size=projects_data[project_name],
    )


@app.route("/projects")
def projects_fullpage():
    return render_template("base.html.j2", title="Projects", page="projects.html.j2")


@app.route("/fragments/projects")
def projects_fragment() -> str:
    return render_template("projects.html.j2")


# Tests
@app.route("/test/transition")
def test_transition():
    return render_template(
        "base.html.j2",
        page="test/transition/index.html.j2",
    )


@app.route("/test/transition/end")
def test_transition_end_fullpage():
    return render_template(
        "base.html.j2",
        page="test/transition/end.html.j2",
    )


@app.route("/test/transition/fragments/end")
def test_transition_end_fragment():
    return render_template("test/transition/end.html.j2")


@app.route("/test/modal")
def test_modal():
    return render_template("test/modal/index.html.j2")


@app.route("/test/modal/fragment")
def test_modal_fragment():
    return render_template("test/modal/modal.html.j2")


@app.route("/test/title-swap")
def test_title_fade_out_and_replace():
    return render_template("test/title-swap/index.html.j2")


@app.route("/test/text-effects/typewriter")
def test_text_effect():
    return render_template("test/text-effects/some.html.j2")


@app.route("/test/text-effects/underline")
def test_underline_effect():
    return render_template("test/text-effects/underline.html.j2")


# Revamp links
@app.route("/revamp")
def revamp_index():
    return render_template("revamp/base.html.j2", page="revamp/index.html.j2")


@app.route("/revamp/fragments/index")
def revamp_index_fragment():
    return render_template("revamp/index.html.j2")


@app.route("/revamp/designs")
def revamp_designs():
    return render_template("revamp/base.html.j2", page="revamp/designs.html.j2", columns=columns_with_dimensions)


@app.route("/revamp/fragments/designs")
def revamp_designs_fragment():
    return render_template("revamp/designs.html.j2", columns=columns_with_dimensions)


@app.route("/revamp/projects")
def revamp_projects():
    return render_template("revamp/base.html.j2", page="revamp/projects.html.j2")


@app.route("/revamp/fragments/projects")
def revamp_projects_fragment():
    return render_template("revamp/projects.html.j2")


@app.route("/revamp/image-focus/<project_name>")
def revamp_image_focus_fragment(project_name: str):
    project_name = project_name.lower()
    if project_name not in projects_data:
        abort(404)
    return render_template("image-focus.html.j2", project_name=project_name, size=projects_data[project_name])


@app.route("/revamp/fragments/image-focus/<project_name>")
def revamp_image_focus_fullpage(project_name: str):
    project_name = project_name.lower()
    if project_name not in projects_data:
        abort(404)
    return render_template(
        "revamp/base.html.j2",
        page="image-focus.html.j2",
        project_name=project_name,
        size=projects_data[project_name],
    )
