from flask import Flask, request, send_file
import cv2
import numpy as np
import tempfile
import os

app = Flask(__name__)

@app.route("/api/remove-bg", methods=["POST"])
def remove_bg():
    print("🔄 Received request at /api/remove-bg")

    if 'image' not in request.files:
        print("🚫 'image' not in request.files")
        return "No image uploaded", 400

    img_file = request.files['image']
    print(f"📸 Received image: {img_file.filename}, type: {img_file.content_type}")

    try:
        # Read raw bytes
        file_bytes = img_file.read()
        file_array = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(file_array, cv2.IMREAD_COLOR)

        if img is None:
            print("❌ imdecode still failed")
            return "Invalid image", 400

        print(f"✅ Image decoded successfully with shape: {img.shape}")

        # Background removal logic
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
        b, g, r = cv2.split(img)
        rgba = cv2.merge([b, g, r, alpha])

        # Save to temp file
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        cv2.imwrite(temp_output.name, rgba)
        print("✅ Background removed and saved:", temp_output.name)

        return send_file(temp_output.name, mimetype="image/png")

    except Exception as e:
        print("❌ Exception occurred:", e)
        return "Processing failed", 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
