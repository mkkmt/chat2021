import time
import random
import IPython
from google.colab import output

# アイコンの指定
BOT_ICON = 'https://2.bp.blogspot.com/-mRJKwyORJkQ/Wn1ZTOBrszI/AAAAAAABKKs/Bg5yjLL9RYwmfUM0pEkBA3Ky3ui0IOZWQCLcBGAs/s800/animal_smile_inu.png'
YOUR_ICON = 'https://4.bp.blogspot.com/-SC6_6x7MQnc/Wn1ZUkdcPxI/AAAAAAABKK8/qqHVlc8E7lEGsEwJ_J8H6Gp9RvfhTX67wCLcBGAs/s800/animal_smile_neko.png'

import requests
import json
import datetime
import pytz
def uranai_api(input_text): #占いAPIを使った場合
  global status
  sign = []
  if status=='':
    status = 'sign'
    return 'あなたの星座の番号を入力してください<br>牡羊座(0)牡牛座(1)双子座(2)蟹座(3)獅子座(4)乙女座(5)天秤座(6)蠍座(7)射手座(8)山羊座(9)水瓶座(10)魚座(11)'
  if status=='sign':
    no = int(input_text.strip())
    now = datetime.datetime.now(pytz.timezone('Asia/Tokyo'))
    today = now.strftime("%Y/%m/%d")
    res = requests.get(url='http://api.jugemkey.jp/api/horoscope/free/'+ today)
    return res.json()["horoscope"][today][no]["content"]
    

def run_chat(chat = uranai_api, start='占いするよ', **kw):

  def display_bot(bot_text):
    with output.redirect_to_element('#output'):
      bot_name = kw.get('bot_name', 'ボット')
      bot_icon = kw.get('bot_icon', BOT_ICON)
      display(IPython.display.HTML(f'''
      <div class="sb-box">
        <div class="icon-img icon-img-left">
            <img src="{bot_icon}" width="60px">
        </div><!-- /.icon-img icon-img-left -->
        <div class="icon-name icon-name-left">{bot_name}</div>
        <div class="sb-side sb-side-left">
            <div class="sb-txt sb-txt-left">
              {bot_text}
            </div><!-- /.sb-txt sb-txt-left -->
        </div><!-- /.sb-side sb-side-left -->
    </div><!-- /.sb-box -->
      '''))

  def display_you(your_text):
    with output.redirect_to_element('#output'):
      your_name = kw.get('your_name', 'あなた')
      your_icon = kw.get('your_icon', YOUR_ICON)

      display(IPython.display.HTML(f'''
      <div class="sb-box">
        <div class="icon-img icon-img-right">
            <img src="{your_icon}" width="60px">
        </div><!-- /.icon-img icon-img-right -->
        <div class="icon-name icon-name-right">{your_name}</div>
        <div class="sb-side sb-side-right">
            <div class="sb-txt sb-txt-right">
              {your_text}
            </div><!-- /.sb-txt sb-txt-right -->
        </div><!-- /.sb-side sb-side-right -->
      </div><!-- /.sb-box -->
      '''))

  display(IPython.display.HTML('''
      <style>
        /* 全体 */
        .sb-box {
            position: relative;
            overflow: hidden;
        }

        /* アイコン画像 */
        .icon-img {
            position: absolute;
            overflow: hidden;
            top: 0;
            width: 80px;
            height: 80px;
        }

        /* アイコン画像（左） */
        .icon-img-left {
            left: 0;
        }

        /* アイコン画像（右） */
        .icon-img-right {
            right: 0;
        }

        /* アイコン画像 */
        .icon-img img {
            border-radius: 50%;
            border: 2px solid #eee;
        }

        /* アイコンネーム */
        .icon-name {
            position: absolute;
            width: 80px;
            text-align: center;
            top: 83px;
            color: #fff;
            font-size: 10px;
        }

        /* アイコンネーム（左） */
        .icon-name-left {
            left: 0;
        }

        /* アイコンネーム（右） */
        .icon-name-right {
            right: 0;
        }

        /* 吹き出し */
        .sb-side {
            position: relative;
            float: left;
            margin: 0 105px 40px 105px;
        }

        .sb-side-right {
            float: right;
        }

        /* 吹き出し内のテキスト */
        .sb-txt {
            position: relative;
            border: 2px solid #eee;
            border-radius: 6px;
            background: #eee;
            color: #333;
            font-size: 15px;
            line-height: 1.7;
            padding: 18px;
        }

        .sb-txt>p:last-of-type {
            padding-bottom: 0;
            margin-bottom: 0;
        }

        /* 吹き出しの三角 */
        .sb-txt:before {
            content: "";
            position: absolute;
            border-style: solid;
            top: 16px;
            z-index: 3;
        }

        .sb-txt:after {
            content: "";
            position: absolute;
            border-style: solid;
            top: 15px;
            z-index: 2;
        }

        /* 吹き出しの三角（左） */
        .sb-txt-left:before {
            left: -7px;
            border-width: 7px 10px 7px 0;
            border-color: transparent #eee transparent transparent;
        }

        .sb-txt-left:after {
            left: -10px;
            border-width: 8px 10px 8px 0;
            border-color: transparent #eee transparent transparent;
        }

        /* 吹き出しの三角（右） */
        .sb-txt-right:before {
            right: -7px;
            border-width: 7px 0 7px 10px;
            border-color: transparent transparent transparent #eee;
        }

        .sb-txt-right:after {
            right: -10px;
            border-width: 8px 0 8px 10px;
            border-color: transparent transparent transparent #eee;
        }

        /* 767px（iPad）以下 */

        @media (max-width: 767px) {

            .icon-img {
                width: 60px;
                height: 60px;
            }

            /* アイコンネーム */
            .icon-name {
                width: 60px;
                top: 62px;
                font-size: 9px;
            }

            /* 吹き出し（左） */
            .sb-side-left {
                margin: 0 0 30px 78px;
                /* 吹き出し（左）の上下左右の余白を狭く */
            }

            /* 吹き出し（右） */
            .sb-side-right {
                margin: 0 78px 30px 0;
                /* 吹き出し（右）の上下左右の余白を狭く */
            }

            /* 吹き出し内のテキスト */
            .sb-txt {
                padding: 12px;
                /* 吹き出し内の上下左右の余白を-6px */
            }
        }
    </style>
      <script>
        var inputPane = document.getElementById('input');
        inputPane.addEventListener('keydown', (e) => {
          if(e.keyCode == 13) {
            google.colab.kernel.invokeFunction('notebook.Convert', [inputPane.value], {});
            inputPane.value=''
          }
        });
      </script>
    <div id='output' style='background: #66d;'></div>
    <div style='text-align: right'><textarea id='input' style='width: 100%; background: #eee;'></textarea></div>
      '''))

  def convert(your_text):
    display_you(your_text)
    bot_text = chat(your_text, **kw)
    time.sleep(random.randint(0,4))
    display_bot(bot_text)

  output.register_callback('notebook.Convert', convert)
  if start is not None:
    display_bot(start)

status = ''
#run_chat()
