from dataclasses import dataclass
from pathlib import Path
from collections import Counter

import PIL.Image


@dataclass(frozen=True)
class ImageSet:
    id: str
    images: tuple[str, ...]


@dataclass(frozen=True)
class ImageMetadata:
    id: str
    dimensions_xy: tuple[int, int]
    fullsize_size_bytes: int
    preview_size_bytes: int


SETS: tuple[ImageSet, ...] = (
    ImageSet(id="alefbeitgimel", images=("alefbeitgimel",)),
    ImageSet(id="pocahontas", images=("pocahontas", "pocahontas2")),
    ImageSet(id="crazaza", images=("crazaza",)),
    ImageSet(id="golden-margarita", images=("golden-margarita", "golden-margarita-bw")),
    ImageSet(id="good-morning", images=("good-morning",)),
    ImageSet(id="goodgood", images=("goodgood",)),
    ImageSet(id="hibbuk", images=("hibbuk1", "hibbuk2")),
    ImageSet(id="jeff", images=("jeff-bright",)),
    ImageSet(id="juice", images=("juice",)),
    ImageSet(id="kraza", images=("kraza",)),
    ImageSet(id="lifta", images=("lifta",)),
    ImageSet(id="maskit", images=("maskit",)),
    ImageSet(id="no-players", images=("no-players",)),
    ImageSet(id="sunshine", images=("sunshine",)),
    ImageSet(id="smoke", images=("smoke",)),
    ImageSet(id="pigumim", images=("pigumim",)),
)


GALLERY_COLUMNS: tuple[tuple[str, ...], tuple[str, ...], tuple[str, ...], tuple[str, ...]] = (
    ("kraza", "juice", "maskit", "pocahontas2"),
    ("pocahontas", "good-morning", "hibbuk1", "lifta", "hibbuk2"),
    ("crazaza", "no-players", "golden-margarita-bw", "smoke"),
    ("jeff-bright", "pigumim", "sunshine", "goodgood"),
)


IMAGE_METADATA: dict[str, ImageMetadata] = dict()
FULLSIZE_PATH: Path
PREVIEWS_PATH: Path
TEMPLATES_PATH: Path


def init(fullsize_path: Path, previews_path: Path, templates_path: Path) -> None:
    global FULLSIZE_PATH, PREVIEWS_PATH, TEMPLATES_PATH
    FULLSIZE_PATH = fullsize_path
    PREVIEWS_PATH = previews_path
    TEMPLATES_PATH = templates_path
    _load_image_metadata()


def validate():
    _validate_no_duplicates_in_columns()
    _validate_no_duplicates_in_sets()
    _validate_column_images_in_sets()
    _validate_images_have_corresponding_files()
    _validate_each_image_has_a_preview()
    _validate_each_set_has_corresponding_template()


def show_image_files_not_in_sets():
    images_in_sets = {img for s in SETS for img in s.images}
    images_on_disk = {p.stem for p in FULLSIZE_PATH.iterdir() if p.is_file()}
    missing = images_on_disk - images_in_sets
    if missing:
        print(f"The following images are in disk but not in sets: {missing}")


def show_unpreviewed_images():
    images_in_sets = {img for s in SETS for img in s.images}
    images_in_columns = {img for col in GALLERY_COLUMNS for img in col}
    missing = images_in_sets - images_in_columns
    if missing:
        print(f"The following images are in sets but not in previews: {missing}")


def _load_image_metadata() -> None:
    images_in_sets = {img for s in SETS for img in s.images}
    for image_name in images_in_sets:
        fullsize_image_path = FULLSIZE_PATH / (image_name + ".webp")
        fullsize_size_bytes = fullsize_image_path.stat().st_size
        preview_image_path = PREVIEWS_PATH / (image_name + ".webp")
        preview_size_bytes = preview_image_path.stat().st_size

        with PIL.Image.open(fullsize_image_path) as image:
            fullsize_dimensions_xy = (image.width, image.height)

        IMAGE_METADATA[image_name] = ImageMetadata(
            image_name, fullsize_dimensions_xy, fullsize_size_bytes, preview_size_bytes
        )


def _validate_no_duplicates_in_sets() -> None:
    images_in_sets = [img for s in SETS for img in s.images]
    counts = Counter(images_in_sets)
    duplicates = {img for (img, count) in counts.items() if count > 1}
    if duplicates:
        raise ValueError(f"Sets contain duplicates: {duplicates}")


def _validate_no_duplicates_in_columns() -> None:
    images_in_columns = [img for col in GALLERY_COLUMNS for img in col]
    counts = Counter(images_in_columns)
    duplicates = {img for (img, count) in counts.items() if count > 1}
    if duplicates:
        raise ValueError(f"Gallery columns contain duplicates: {duplicates}")


def _validate_column_images_in_sets() -> None:
    images_in_sets = {img for s in SETS for img in s.images}
    images_in_columns = {img for col in GALLERY_COLUMNS for img in col}
    missing = images_in_columns - images_in_sets
    if missing:
        raise ValueError(f"Gallery columns contain images not in sets: {missing}")


def _validate_images_have_corresponding_files():
    images_on_disk = {p.stem for p in FULLSIZE_PATH.iterdir() if p.is_file()}
    images_in_sets = {img for s in SETS for img in s.images}
    missing = images_in_sets - images_on_disk
    if missing:
        raise ValueError(f"Sets contain images not in filesystem: {missing}")


def _validate_each_image_has_a_preview():
    images_on_fullsize = {p.stem for p in FULLSIZE_PATH.iterdir() if p.is_file()}
    images_on_previews = {p.stem for p in PREVIEWS_PATH.iterdir() if p.is_file()}
    missing = images_on_fullsize - images_on_previews
    if missing:
        raise ValueError(f"Some fullsize images do not have previews: {missing}")


def _validate_each_set_has_corresponding_template():
    set_names = {s.id for s in SETS}
    templates = {p.name.removesuffix(".html.j2") for p in TEMPLATES_PATH.iterdir() if p.is_file()}
    missing_templates = set_names - templates
    missing_sets = templates - set_names
    if missing_templates:
        raise ValueError(f"Some sets don't have a corresponding template: {missing_templates}")
    if missing_sets:
        raise ValueError(f"Some templates don't have a corresponding set: {missing_sets}")


if __name__ == "__main__":
    init(
        Path("src/toosh_co_il/static/images/preview"),
        Path("src/toosh_co_il/static/images/fullsize"),
        Path("src/toosh_co_il/templates/main/image-sets"),
    )
    validate()
    show_image_files_not_in_sets()
    show_unpreviewed_images()
