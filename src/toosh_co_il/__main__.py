import subprocess


def start_dev_mode():
    print("Starting dev environment")
    subprocess.Popen(["Flask", "--debug", "--app", "toosh_co_il", "run"])
    subprocess.Popen(
        ["tailwindcss", "-w", "-i", "./src/tailwind/styles.css", "-o", "./src/toosh_co_il/static/dist/tailwind.css"]
    )


if __name__ == "__main__":
    start_dev_mode()
