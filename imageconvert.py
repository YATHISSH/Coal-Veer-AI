from PIL import Image
import pytesseract

# Set the path to the Tesseract executable (update this path based on your installation)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def perform_ocr(image_path):
    # Open an image using PIL (Python Imaging Library)
    print(image_path)
    img = Image.open(image_path)

    # Perform OCR on the image
    text = pytesseract.image_to_string(img)

    return text

if __name__ == "__main__":
    # Replace 'path/to/your/image.png' with the actual path to the image you want to process
    image_path = 'f://mining1.jpg'
    
    # Perform OCR on the image
    result_text = perform_ocr(image_path)

    # Print the recognized text
    print("Recognized Text:")
    print(result_text)
