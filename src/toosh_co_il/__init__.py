from dataclasses import dataclass
from datetime import datetime
from typing import TypeGuard, assert_never
from flask import Flask, abort, render_template
import json
import PIL.Image
import pathlib

app = Flask(__name__)

gallery_format: list[list[str]] = [
    ["juice", "maskit", "pocahontas2"],
    ["pocahontas", "good-morning", "hibbuk1", "alefbeitgimel"],
    ["golden-margarita-bw", "smoke", "lifta"],
    ["sunshine", "goodgood", "hibbuk2", "pigumim"],
]


@dataclass
class PreviewInfo:
    title: str
    subtitle: str
    creation_date: datetime
    description: list[str]
    dimensions: tuple[int, int]


def load_gallery() -> dict[str, PreviewInfo]:
    def is_str_list(val: list[object]) -> TypeGuard[list[str]]:
        return all(isinstance(x, str) for x in val)

    assert app.static_folder is not None
    static_dir = pathlib.Path(app.static_folder)
    projects_dir = static_dir / "projects"
    assert projects_dir.is_dir()

    projects: dict[str, PreviewInfo] = {}
    for project_path in projects_dir.iterdir():
        assert project_path.is_dir()
        assert (project_path / "metadata.json").is_file()
        assert (project_path / "preview.webp").is_file()

        with (
            (project_path / "metadata.json").open() as metadata_json_file,
            PIL.Image.open(project_path / "preview.webp") as preview_file,
        ):
            dimensions = preview_file.width, preview_file.height

            match json.load(metadata_json_file):
                case {
                    "title": str(title),
                    "subtitle": str(subtitle),
                    "creationDate": str(isotime),
                    "description": list(description),  # type: ignore
                }:
                    assert is_str_list(description)  # type: ignore
                    project_info = PreviewInfo(
                        title, subtitle, datetime.fromisoformat(isotime), description, dimensions
                    )
                case anything_else:
                    assert_never(anything_else)

        projects[project_path.name] = project_info

    for column in gallery_format:
        for item in column:
            assert item in projects

    return projects


all_projects = load_gallery()

enhanced_gallery_with_sizes: list[list[tuple[str, tuple[int, int]]]] = []

for col in gallery_format:
    enhanced_gallery_with_sizes.append([(name, all_projects[name].dimensions) for name in col])
print(enhanced_gallery_with_sizes)


@app.route("/")
def index() -> str:
    return render_template("base.html.j2", title="Toosh", page="index.html.j2", columns=enhanced_gallery_with_sizes)


@app.route("/fragments/preview/<project_name>")
def preview_fragment(project_name: str) -> str:
    return render_template(
        "preview-fragment.html.j2", project_name=project_name, size=all_projects[project_name].dimensions
    )


@app.route("/project/<project_name>")
def item_focus(project_name: str) -> str:
    if project_name not in all_projects:
        abort(404, "I didn't work on any project like that")

    project_info = all_projects[project_name]

    return render_template(
        "base.html.j2",
        page="item-focus.html.j2",
        title=project_info.title,
        subtitle=project_info.subtitle,
        paragraphs=project_info.description,
        project=project_name,
    )


@app.route("/fragments/index")
def index_fragment() -> str:
    return render_template("index.html.j2", columns=enhanced_gallery_with_sizes)


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
