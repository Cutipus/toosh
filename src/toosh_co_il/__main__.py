import subprocess


def start_dev_mode():
    print("Starting dev environment")
    subprocess.Popen(["flask", "--no-debug", "--app", "toosh_co_il", "run"])
    subprocess.Popen(
        [
            "npx",
            "tailwindcss",
            "--watch",
            "--poll",
            "--input",
            "./src/tailwind/styles.css",
            "--output",
            "./src/toosh_co_il/static/dist/tailwind.css",
        ],
        stdin=subprocess.DEVNULL,
    )


if __name__ == "__main__":
    start_dev_mode()
