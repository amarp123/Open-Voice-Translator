from translate import Translator

def translate_text(text, from_lang, to_lang):
    translator = Translator(from_lang=from_lang, to_lang=to_lang)
    translated_text = translator.translate(text)
    return translated_text

if __name__ == "__main__":
    import sys
    import io

    # Ensure standard output is set to UTF-8
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    text = sys.argv[1]
    from_lang = sys.argv[2]
    to_lang = sys.argv[3]
    print(translate_text(text, from_lang, to_lang))
