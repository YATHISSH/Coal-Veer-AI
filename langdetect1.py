from langdetect import detect

def detect_language(text):
    try:
        language = detect(text)
        print(language)
        return language
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    #input_text = input("Enter the text to detect its language: ")
    detected_language = detect_language("வணக்கம்")

    if detected_language:
        print(f"Detected language: {detected_language}")
    else:
        print("Language detection failed.")
