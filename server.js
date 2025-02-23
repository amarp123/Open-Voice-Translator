
from translate import Translator
from deep_translator import GoogleTranslator

def translate_text_online(text, from_lang, to_lang):
    translator = GoogleTranslator(source=from_lang, target=to_lang)
    translated_text = translator.translate(text)
    return translated_text

def translate_text_offline(text, from_lang, to_lang):
    try:
        translator = Translator(from_lang=from_lang, to_lang=to_lang)
        translated_text = translator.translate(text)
        return translated_text
    except Exception as e:
        print(f"Error during translation: {e}")
        return "Translation error occurred."

if __name__ == "__main__":
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    text = sys.argv[1]
    from_lang = sys.argv[2]
    to_lang = sys.argv[3]
    mode = sys.argv[4]  # 'online' or 'offline'

    if mode == 'online':
        translated_text = translate_text_online(text, from_lang, to_lang)
    elif mode == 'offline':
        translated_text = translate_text_offline(text, from_lang, to_lang)
    else:
        raise ValueError("Invalid mode. Use 'online' or 'offline'.")

    print(translated_text)  


