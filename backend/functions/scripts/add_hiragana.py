import requests

from enum import IntEnum

# The order of these arrays is signficant

HIRAGANAS = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も',
    'や',       'ゆ',     'よ',
    'ら', 'り', 'る', 'れ', 'ろ',
    'わ', 'ゐ',      'ゑ', 'を',
                        'ん',
    'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
    'だ', 'ぢ', 'づ', 'で', 'ど',
    'ば', 'び', 'ぶ', 'べ', 'ぼ',
    'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
]

KATAKANAS = [
    'ア', 'イ', 'ウ', 'エ', 'オ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ',      'ユ',      'ヨ',
    'ラ', 'リ', 'ル', 'レ', 'ロ',
    'ワ', 'ヰ',      'ヱ', 'ヲ',
                        'ン',
    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
    'パ', 'ピ', 'プ', 'ペ', 'ポ',

]

ROMANJIS = [
    'a', 'i', 'u', 'e', 'o',
    'ka', 'ki', 'ku', 'ke', 'ko',
    'sa', 'shi', 'su', 'se', 'so',
    'ta', 'chi', 'tsu', 'te', 'to',
    'na', 'ni', 'nu', 'ne', 'no',
    'ha', 'hi', 'fu', 'he', 'ho',
    'ma', 'mi', 'mu', 'me', 'mo',
    'ya',        'yu',      'yo',
    'ra', 'ri', 'ru', 're', 'ro',
    'wa', 'wi',        'we', 'wo',
                'n',
    'ga', 'ji', 'gu', 'ge', 'go',
    'za', 'ji', 'zu', 'ze', 'zo',
    'da', 'di', 'du', 'de', 'do',
    'ba', 'bi', 'bu', 'be', 'bo',
    'pa', 'pi', 'pu', 'pe', 'po',

]


class ScriptMode(IntEnum):
    TEST = 0,
    PROD = 1


def send_to_db(url: str, hiragana: str, katakana: str, romanji: str):
    query: str = f'?ro={romanji}&ka={katakana}&hi={hiragana}'
    try:
        # Format to make the post request
        res = requests.get(
            url, params={'ro': romanji, 'hi': hiragana, 'ka': katakana})
        if (res.status_code == 200):
            print(f'Duplicate entry: {query}')
        elif (res.status_code == 201):
            print("Successfully added")
        else:
            print(f'Status {res.status_code} there was problem with {query}')
    except Exception as e:
        print(e)


def send_kana_to_url(url: str):
    postUrl = url + '/addKana'

    for hiragana, katakana, romanji in zip(HIRAGANAS, KATAKANAS, ROMANJIS):
        send_to_db(postUrl, hiragana, katakana, romanji)


def run(mode: ScriptMode) -> None:
    if mode == ScriptMode.PROD:
        print('Running in production')
        url = 'https://us-central1-endless-kana.cloudfunctions.net'
    elif mode == ScriptMode.TEST:
        print('Running in test')
        url = 'http://localhost:5001/endless-kana/us-central1'
    else:
        raise Exception("ScriptMode not handled")

    send_kana_to_url(url)


if __name__ == '__main__':
    try:
        print("Starting script")
        # Set mode to set which url requests are made to
        mode = ScriptMode.TEST
        run(mode)
        print("Script running complete")
    except Exception as e:
        print(e)
