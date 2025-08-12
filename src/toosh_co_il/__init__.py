import mimetypes
import time
from flask import Flask, render_template, redirect, url_for, Response
import pathlib

from jinja2 import TemplateNotFound
from werkzeug.exceptions import NotFound

from toosh_co_il import gallery_config

mimetypes.add_type("image/webp", ".webp")

app = Flask(__name__)


def load_gallery_config():
    assert app.static_folder is not None
    assert app.template_folder is not None
    fullsize_path = pathlib.Path(app.static_folder) / "images" / "fullsize"
    previews_path = pathlib.Path(app.static_folder) / "images" / "preview"
    templates_path = pathlib.Path(app.root_path) / app.template_folder / "main" / "image-sets"
    gallery_config.init(fullsize_path, previews_path, templates_path)
    gallery_config.validate()
    gallery_config.show_image_files_not_in_sets()
    gallery_config.show_unpreviewed_images()


load_gallery_config()


@app.context_processor
def gallery_config_context():
    return dict(
        gallery_columns=gallery_config.GALLERY_COLUMNS,
        image_sets=gallery_config.SETS,
        image_metadata=gallery_config.IMAGE_METADATA,
    )


@app.after_request
def add_cache_header(response: Response):
    response.cache_control.max_age = 31536000
    response.cache_control.public = True
    response.add_etag()
    response.cache_control.immutable = True
    return response


# Standard Routes


@app.route("/")
def index():
    return redirect(url_for("gallery"))


@app.route("/gallery")
def gallery():
    return render_template("main/base.html.j2", page="main/gallery.html.j2")


@app.route("/fragments/gallery")
def gallery_fragment():
    return render_template("main/gallery.html.j2")


@app.route("/about")
def about():
    return render_template("main/base.html.j2", page="main/about.html.j2")


@app.route("/fragments/about")
def about_fragment():
    return render_template("main/about.html.j2")


@app.route("/projects")
def projects():
    return render_template("main/base.html.j2", page="main/projects.html.j2")


@app.route("/fragments/projects")
def projects_fragment():
    return render_template("main/projects.html.j2")


@app.route("/modal-views/<set_name>")
def modal_view(set_name):
    image_set = next((s for s in gallery_config.SETS if s.id == set_name), None)

    if image_set is None:
        raise NotFound("No such modal view!")

    try:
        return render_template(f"main/image-sets/{set_name}.html.j2")
    except TemplateNotFound:
        return render_template(f"main/modal-view.html.j2", image_set=image_set)


# Tests


@app.route("/test/transition")
def test_transition():
    return render_template("base.html.j2", page="test/transition/index.html.j2")


@app.route("/test/transition/end")
def test_transition_end_fullpage():
    return render_template("base.html.j2", page="test/transition/end.html.j2")


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


@app.route("/test/text-effects/displacement")
def test_displacement_effect():
    return render_template("test/text-effects/displacement.html.j2")


@app.route("/test/text-effects/hoverbold")
def test_hoverbold():
    return render_template("test/text-effects/hoverbold.html.j2")


@app.route("/test/newlink")
def test_newlink():
    return render_template("test/text-effects/displacement.html.j2")


@app.route("/test/scrolling")
def test_scrolling():
    return render_template("test/scrolling/basic.html.j2")
