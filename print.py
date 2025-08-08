import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QTextEdit, QHBoxLayout,
    QFileDialog, QSpinBox, QLabel
)
from PyQt6.QtGui import QClipboard
from PyQt6.QtCore import Qt


class ProjectExplorerApp(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Project Explorer")
        self.setGeometry(200, 200, 900, 650)

        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Layouts
        main_layout = QVBoxLayout()
        button_layout = QHBoxLayout()
        control_layout = QHBoxLayout()

        # File tree & content areas
        self.tree_display = QTextEdit()
        self.tree_display.setReadOnly(True)

        self.content_display = QTextEdit()
        self.content_display.setReadOnly(True)

        # Controls
        self.select_dir_button = QPushButton("Select Directory")
        self.select_dir_button.clicked.connect(self.select_directory)

        self.depth_label = QLabel("Depth:")
        self.depth_spin = QSpinBox()
        self.depth_spin.setMinimum(0)
        self.depth_spin.setMaximum(50)
        self.depth_spin.setValue(2)
        self.depth_spin.valueChanged.connect(self.update_depth)

        self.copy_tree_button = QPushButton("Copy Project Tree")
        self.copy_tree_button.clicked.connect(self.copy_tree_text)

        self.copy_content_button = QPushButton("Copy File Contents")
        self.copy_content_button.clicked.connect(self.copy_content_text)

        self.refresh_button = QPushButton("Refresh")
        self.refresh_button.clicked.connect(self.refresh_display)

        # Arrange control layout
        control_layout.addWidget(self.select_dir_button)
        control_layout.addWidget(self.depth_label)
        control_layout.addWidget(self.depth_spin)

        # Arrange button layout
        button_layout.addWidget(self.copy_tree_button)
        button_layout.addWidget(self.copy_content_button)
        button_layout.addWidget(self.refresh_button)

        main_layout.addLayout(control_layout)
        main_layout.addWidget(self.tree_display)
        main_layout.addLayout(button_layout)
        main_layout.addWidget(self.content_display)

        central_widget.setLayout(main_layout)

        # Config
        self.directory_path = None
        self.max_depth = self.depth_spin.value()
        self.max_bytes = 300_000
        self.skip_dirs = {".git", "__pycache__", "node_modules"}
        self.text_exts = {
            ".txt", ".md", ".markdown", ".py", ".js", ".ts", ".tsx", ".jsx", ".json",
            ".yml", ".yaml", ".ini", ".cfg", ".toml", ".css", ".scss", ".sass",
            ".html", ".htm", ".jinja", ".jinja2", ".jinja-html", ".jinja2-html",
            ".sh", ".bat", ".ps1", ".rb", ".php", ".java", ".c", ".cpp", ".h", ".hpp"
        }

    def select_directory(self):
        directory = QFileDialog.getExistingDirectory(self, "Select Base Directory")
        if directory:
            self.directory_path = directory
            self.refresh_display()

    def update_depth(self, value):
        self.max_depth = value
        if self.directory_path:
            self.refresh_display()

    def display_project_tree(self, depth=None):
        if depth is None:
            depth = self.max_depth
        self.tree_display.clear()
        output = []
        if self.directory_path:
            self._print_project_tree(self.directory_path, depth, output)
        else:
            output.append("No directory selected.")
        self.tree_display.setPlainText("\n".join(output))

    def _print_project_tree(self, directory, depth, output, indent=""):
        if depth < 0:
            return
        try:
            entries = sorted(os.listdir(directory))
        except PermissionError:
            output.append(indent + "Permission denied.")
            return
        except FileNotFoundError:
            output.append(indent + f"Path not found: {directory}")
            return

        for entry in entries:
            path = os.path.join(directory, entry)
            if os.path.isdir(path):
                if entry in self.skip_dirs:
                    continue
                output.append(indent + f"📁 {entry}/")
                self._print_project_tree(path, depth - 1, output, indent + "  ")
            else:
                output.append(indent + f"📄 {entry}")

    def display_file_contents(self):
        self.content_display.clear()
        output = []

        if not self.directory_path:
            self.content_display.setPlainText("No directory selected.")
            return

        base = os.path.abspath(self.directory_path)
        if not os.path.isdir(base):
            self.content_display.setPlainText(f"Base directory not found: {base}")
            return

        base_depth = base.count(os.sep)

        for root, dirs, files in os.walk(base):
            dirs[:] = [d for d in dirs if d not in self.skip_dirs]
            current_depth = os.path.abspath(root).count(os.sep) - base_depth
            if current_depth > self.max_depth:
                dirs[:] = []
                continue

            rel_root = os.path.relpath(root, base)
            for fname in files:
                full_path = os.path.join(root, fname)
                ext = os.path.splitext(fname)[1].lower()
                rel_path = os.path.normpath(os.path.join(rel_root, fname)) if rel_root != "." else fname

                try:
                    size_ok = os.path.getsize(full_path) <= self.max_bytes
                except OSError:
                    size_ok = False
                if not size_ok:
                    continue

                if (ext in self.text_exts) or self._looks_text_file(full_path):
                    output.append(f"\n--- Contents of {rel_path} ---")
                    try:
                        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
                            output.append(f.read())
                    except Exception as e:
                        output.append(f"Error reading {rel_path}: {e}")

        if not output:
            output = ["No readable files found within the specified depth/filters."]
        self.content_display.setPlainText("\n".join(output))

    def _looks_text_file(self, path, sniff_bytes=2048):
        try:
            with open(path, "rb") as f:
                chunk = f.read(sniff_bytes)
            chunk.decode("utf-8")
            return True
        except Exception:
            return False

    def copy_tree_text(self):
        clipboard = QApplication.clipboard()
        clipboard.setText(self.tree_display.toPlainText())

    def copy_content_text(self):
        clipboard = QApplication.clipboard()
        clipboard.setText(self.content_display.toPlainText())

    def refresh_display(self):
        self.display_project_tree()
        self.display_file_contents()


def main():
    app = QApplication(sys.argv)
    window = ProjectExplorerApp()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
