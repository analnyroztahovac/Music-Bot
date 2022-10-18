# Discord - Music Bot

Zdrojovy kod pre Music Bota vytvoreneho pomocou `discord.js`.

## Zakladne info + parametre

Cielom projektu (pre mna) je nadobudnut nejake skusenosti v JavaScripte.</br>
Hlavnym cielom bota je poskytnut prehravanie hudby vo Voice kanali pomocou par prikazov, teda ziadny bloatware s 80 prikazmi od A po Z...

**+** Node verzia -> `v16.18.0`</br>
**+** Discord JS verzia -> `14.6.0`</br>
**+** Start projektu: `8.10.2022`</br>

### Todo List:
 - [x] [`/play { song | search | playlist }`](https://github.com/analnyroztahovac/Music-Bot/blob/main/guild_commands/play.js) prikaz
 - [x] [`/info`](https://github.com/analnyroztahovac/Music-Bot/blob/main/global_commands/info.js) prikaz
 - [x] [`/poradie`](https://github.com/analnyroztahovac/Music-Bot/blob/main/guild_commands/poradie.js) prikaz
 - [x] [`/skip`](https://github.com/analnyroztahovac/Music-Bot/blob/main/guild_commands/skip.js) prikaz
 - [x] [`/stop`](https://github.com/analnyroztahovac/Music-Bot/blob/main/guild_commands/stop.js) prikaz
 - [x] ~~Konfiguracia povolenych / zakazanych kanalov~~ ( pouzi server integrations )
 - [x] Konfiguracia embedov = [farba, footer](https://github.com/analnyroztahovac/Music-Bot/blob/main/config.json)

## Contributions

Urcite by nevadilo pokial by sa chcel niekto na projekte podielat, prispiet nejakym kodom pre vylepsenie, opravenie, optimalizaciu (and watnot) bota. Pred samotnym PRnutim ma vsak treba informovat, aby sme si povedali co a ako ( aby nedoslo k nejakym nezhodam a teda aby som nemal nejaky extra dovod zamietnu PR ).</br>
Pri PR nezabudnite **dostatocne** okomentovat kod.

### Kontakt
Discord - `drjoenh#6291` <sub> ( ID ak si zmenim discriminator alebo nick `656146295555358736` )</sub>

## Mini-Wiki

### Info:
Pre hostovanie Bota na svojom PC, pripadne VPS ( *alebo co si vyberiete* ) je potrebne zmenit v [`config.json`](https://github.com/analnyroztahovac/Music-Bot/blob/main/config.json) subore `token` ako aj `guildID`, `clientID` ( ID Bota ), `emoji_check`, `emoji_error` ( Zobrazuje Emoji pri embed spravach ):

```yaml 
{
  "token": "vas_token",
  "clientID": "id_vasho_bota",
  "guildID": "id_vasho_servera",
  "emoji_check": "id_vasho_emoji",
  "emoji_error": "id_vasho_emoji"
}
```

Format pre nastavovanie emoji je -> `<:emoji_nazov:emoji_id>`.</br>
Token svojho Bota ako aj jeho ID najdete na stranke http://discord.com/developers/, vo vami vytvorenej aplikacii.</br>
( Navod pre vytvorenie aplikacie -> https://discord.com/developers/docs/getting-started ) </br> 
Po nastaveni `config.yml` sa uistite, ze ste spustili ( *Netreba pri kazdom zapnuti iba, iba pri prvom pre registrovanie guild prikazov na vami vybranom serveri.* ) `deploy-commands.js`, ktore Vam zaregistruje dane prikazy na serveri.</br>
Po uspesnom rozbehnuti Bota sa uistite, ze mate nainstalovane aj [`FFmpeg`](https://ffmpeg.org/), bez toho Bot nemoze prehravat hudbu vo Voice kanaloch.


### Hostovanie na VPS:
 - Kompletny navod pre hostovanie DC Bota na VPS -> https://www.writebots.com/discord-bot-hosting/
 - Navod pre nainstalovanie FFmpeg na Ubuntu -> https://linuxize.com/post/how-to-install-ffmpeg-on-ubuntu-20-04/

### Nastavovanie permisii:
- Pre nastavovanie permisii pre pouzitie roznych prikazov v roznych kanaloch je mozne pouzit built-in Discord funkciu v `Server Integrations` na danom discord serveri.</br>
![ukazka_raw](https://user-images.githubusercontent.com/89749147/196278725-a9747a77-a487-4101-bcd6-d63d49399904.png)


## Licencia
MIT License

Copyright (c) 2022 david

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
