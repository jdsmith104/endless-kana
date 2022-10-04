import requests

from enum import IntEnum


hiraganaArray = [
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

romanjiArray = [
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
    'ga', 'gi', 'gu', 'ge', 'go',
    'za', 'zi', 'zu', 'ze', 'zo',
    'da', 'di', 'du', 'de', 'do',
    'ba', 'bi', 'bu', 'be', 'bo',
    'pa', 'pi', 'pu', 'pe', 'po',

]


class ScriptMode(IntEnum):
    TEST = 0,
    PROD = 1


def makePostRequest(url: str, jp: str, en: str, category: str):
    query: str = f'?en={en}&jp={jp}&category={category}'
    try:
        # Format to make the post request
        res = requests.get(
            url, params={'en': en, 'jp': jp, 'category': category})
        if (res.status_code == 200):
            print(f'Duplicate entry: {query}')
        elif (res.status_code == 201):
            print("Successfully added")
        else:
            print(f'Status {res.status_code} there was problem with {query}')
    except Exception as e:
        print(e)


def addKanaToTest(url: str):
    postUrl = url + '/addKana'

    for jp, en in zip(hiraganaArray, romanjiArray):
        makePostRequest(postUrl, jp, en, "hiragana")


def run(mode: ScriptMode):
    url = ''

    if mode == ScriptMode.PROD:
        print('Running in production')
        url = 'https://us-central1-endless-kana.cloudfunctions.net'
    if mode == ScriptMode.TEST:
        print('Running in test')
        url = 'http://localhost:5001/endless-kana/us-central1'
    else:
        raise Exception("ScriptMode not handled")

    addKanaToTest(url)


if __name__ == '__main__':
    try:
        run(ScriptMode.TEST)
        print("Script running complete")
    except Exception as e:
        print(e)
