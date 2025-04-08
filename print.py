import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QTextEdit, QFileDialog, QHBoxLayout
)
from PyQt6.QtGui import QClipboard
from PyQt6.QtCore import Qt


class ProjectExplorerApp(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Project Explorer")
        self.setGeometry(200, 200, 800, 600)
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Layouts
        main_layout = QVBoxLayout()
        button_layout = QHBoxLayout()
        
        # Widgets
        self.tree_display = QTextEdit()
        self.tree_display.setReadOnly(True)
        
        self.content_display = QTextEdit()
        self.content_display.setReadOnly(True)

        self.copy_tree_button = QPushButton("Copy Project Tree")
        self.copy_tree_button.clicked.connect(self.copy_tree_text)

        self.copy_content_button = QPushButton("Copy File Contents")
        self.copy_content_button.clicked.connect(self.copy_content_text)

        self.refresh_button = QPushButton("Refresh")
        self.refresh_button.clicked.connect(self.refresh_display)
        
        # Arrange layout
        button_layout.addWidget(self.copy_tree_button)
        button_layout.addWidget(self.copy_content_button)
        button_layout.addWidget(self.refresh_button)

        main_layout.addWidget(self.tree_display)
        main_layout.addLayout(button_layout)
        main_layout.addWidget(self.content_display)
        
        central_widget.setLayout(main_layout)
        
        # Initial load
        self.directory_path = "/Users/zandipie/Desktop/Work/VibeOps"  # Set your base directory
        self.included_paths = [
            "site-v1/static",
            "site-v1/static/Logo-blk.png",
            "site-v1/static/Logo-wht.png",
            "site-v1/static/Logo.png",
            "site-v1/static/styles.css",
            "site-v1/templates",
            "site-v1/templates/index.html",
            "site-v1/app.py"
        ]
        self.display_project_tree()
        self.display_file_contents()
        
    def display_project_tree(self, depth=2):
        self.tree_display.clear()
        output = []
        self._print_project_tree(self.directory_path, depth, output)
        self.tree_display.setPlainText("\n".join(output))
    
    def _print_project_tree(self, directory, depth, output, indent=""):
        if depth < 0:
            return

        try:
            entries = sorted(os.listdir(directory))
        except PermissionError:
            output.append(indent + "Permission denied.")
            return

        for entry in entries:
            path = os.path.join(directory, entry)
            if os.path.isdir(path):
                output.append(indent + f"📁 {entry}/")
                self._print_project_tree(path, depth - 1, output, indent + "  ")
            else:
                output.append(indent + f"📄 {entry}")

    def display_file_contents(self):
        self.content_display.clear()
        output = []
        for relative_path in self.included_paths:
            full_path = os.path.join(self.directory_path, relative_path)
            output.append(f"\n--- Contents of {relative_path} ---")
            if os.path.exists(full_path):
                try:
                    with open(full_path, 'r') as file:
                        output.append(file.read())
                except Exception as e:
                    output.append(f"Error reading {relative_path}: {e}")
            else:
                output.append(f"{relative_path} not found")
        self.content_display.setPlainText("\n".join(output))
        
    def copy_tree_text(self):
        clipboard = QApplication.clipboard()
        clipboard.setText(self.tree_display.toPlainText())

    def copy_content_text(self):
        clipboard = QApplication.clipboard()
        clipboard.setText(self.content_display.toPlainText())
        
    def refresh_display(self):
        self.display_project_tree()
        self.display_file_contents()

# Run the application
app = QApplication(sys.argv)
window = ProjectExplorerApp()
window.show()
sys.exit(app.exec())
