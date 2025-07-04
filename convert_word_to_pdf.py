import sys
from docx2pdf import convert
import os

def main():
    try:
        input_path = sys.argv[1]
        output_folder = sys.argv[2]

        # Ensure output folder exists
        os.makedirs(output_folder, exist_ok=True)

        # docx2pdf expects output_folder, not a file path
        convert(input_path, output_folder)
        print("Success")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
