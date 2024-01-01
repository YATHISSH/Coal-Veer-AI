import speech_recognition as sr
from googletrans import Translator

def transcribe_and_translate(audio_file_path, languages=["en-IN", "hi-IN", "te-IN", "ta-IN", "bn-IN", "ml-IN", "gu-IN", "mr-IN", "kn-IN", "pa-IN"]):
    recognizer = sr.Recognizer()
    translator = Translator()

    with sr.AudioFile(audio_file_path) as source:
        audio = recognizer.record(source)

    for language in languages:
        try:
            text = recognizer.recognize_google(audio, language=language)
            print(f"Transcription in {language}: {text}")
            
            # Translate to English
            translation = translator.translate(text, src=language, dest="en")
            print(f"Translation to English: {translation.text}")

        except sr.UnknownValueError:
            print(f"Could not understand audio for language {language}")
        except sr.RequestError as e:
            print(f"Error making the request for language {language}: {e}")

#audio_path = "your_audio_file_path.wav"  # Replace with your audio file path
language_codes = ["en-IN", "hi-IN", "te-IN", "ta-IN", "bn-IN", "ml-IN", "gu-IN", "mr-IN", "kn-IN", "pa-IN"]
#transcribe_and_translate(audio_path, languages=language_codes)