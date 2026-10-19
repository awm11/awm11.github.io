#!/usr/bin/env python3
"""Offline helper for public/resources/index.html (no network: the shell cannot reach the web).

  resources.py diff NEW.txt      compare a fresh extract of the Google Doc with the page
  resources.py add NEW.txt       insert the NEW links (from `diff`) into the data block
  resources.py remove URL...     delete links from the data block (and their keywords)
  resources.py todo              links still needing keywords / a real thumbnail (JSON)
  resources.py kw FILE.json      merge {url: "kw, kw"} into the keyword block
  resources.py urls [--yt|--other]  list URLs to check for link rot
NEW.txt uses the page's own data format:  '# LEVEL', '## CODE @@ NAME', '### Sub', '- Title @@ URL @@ note'
"""
import json, re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.join(HERE, '..', '..', 'public', 'resources', 'index.html')
DNA = os.path.join(HERE, 'do-not-add.txt')
YT = re.compile(r'(?:v=|youtu\.be/|shorts/)([\w-]{11})')
DATA = re.compile(r'(<script id="data" type="text/plain">\n?)(.*?)(</script>)', re.S)
KW = re.compile(r'(<script id="kw" type="application/json">)(.*?)(</script>)', re.S)

def norm(u):
    m = YT.search(u)
    if m: return 'yt:' + m.group(1)
    u = re.sub(r'^https?://(www\.)?', '', u.strip()).split('#')[0].rstrip('/')
    return u.lower()

LEVELS = ['GCSE', 'A Level', 'KS3']
def parse(text, names=None):
    """-> list of dicts(level, code, name, sub, title, url, note, line).
    Also accepts Google-Doc style headings: '# A Level resources', '## P1 - Energy', '## Magnetism'
    (a bare name is resolved to its code through `names`={(level,name):code})."""
    out, level, code, name, sub = [], '', '', '', ''
    for i, ln in enumerate(text.split('\n')):
        s = ln.strip()
        if s.startswith('### '): sub = s[4:].strip()
        elif s.startswith('## '):
            h = s[3:]
            if '@@' in h: code, _, name = h.partition('@@')
            elif ' - ' in h: code, _, name = h.partition(' - ')
            else: code, name = '', h
            code, name, sub = code.strip(), name.strip(), ''
            if not code and names: code = names.get((level, name.lower()), '')
        elif s.startswith('# '):
            level = s[2:].strip()
            level = next((l for l in LEVELS if level.lower().startswith(l.lower())), level)
            code, name, sub = '', '', ''
        elif s.startswith('- '):
            p = [x.strip() for x in s[2:].split('@@')]
            if len(p) >= 2:
                out.append(dict(level=level, code=code, name=name, sub=sub, title=p[0], url=p[1],
                                note=p[2] if len(p) > 2 else '', line=i))
    return out

def page(): return open(PAGE, encoding='utf-8').read()
def data_of(h): return DATA.search(h).group(2)
def kw_of(h): return json.loads(KW.search(h).group(2).replace('<\\/', '</'))
def put_kw(h, d):
    blk = json.dumps(d, ensure_ascii=False).replace('</', '<\\/')
    return KW.sub(lambda m: m.group(1) + blk + m.group(3), h, 1)

def rules():
    r = []
    for ln in open(DNA, encoding='utf-8'):
        ln = ln.strip()
        if ln and not ln.startswith('#'): r.append(ln)
    return r
def blocked(it):
    for r in rules():
        if r.lower().startswith('url:'):
            if r[4:].strip().lower() in it['url'].lower(): return r
        elif r.lower().startswith('re:'):
            if re.search(r[3:].strip(), it['title'], re.I): return r
        elif r.lower() in it['title'].lower(): return r
    return None

def sec(it): return (it['level'], it['code'])
def label(it): return f"{it['level']} {it['code']}" + (f" / {it['sub']}" if it['sub'] else '')

def namemap(cur): return {(i['level'], i['name'].lower()): i['code'] for i in cur}
def cmd_diff(new_file):
    cur = parse(data_of(page()))
    new = parse(open(new_file, encoding='utf-8').read(), namemap(cur))
    cm = {}; [cm.setdefault(norm(i['url']), i) for i in cur]
    nm = {}; dups = []
    for i in new:
        k = norm(i['url'])
        if k in nm:
            if sec(nm[k]) == sec(i) and nm[k]['sub'] == i['sub']: dups.append(i)  # same link twice in one place
        else: nm[k] = i
    added = [i for k, i in nm.items() if k not in cm]
    removed = [i for k, i in cm.items() if k not in nm and not i['url'].startswith('/')]  # '/x/' = own sims, managed elsewhere
    moved = [(cm[k], i) for k, i in nm.items() if k in cm and sec(cm[k]) != sec(i)]
    retitled = [(cm[k], i) for k, i in nm.items() if k in cm and cm[k]['title'] != i['title']]
    ok = [i for i in added if not blocked(i)]; bad = [(i, blocked(i)) for i in added if blocked(i)]
    print(f"page {len(cur)} | doc {len(new)} | NEW {len(ok)} | BLOCKED {len(bad)} | REMOVED {len(removed)} | MOVED {len(moved)} | RETITLED {len(retitled)} | dup-in-doc {len(dups)}")
    for i in ok: print('NEW      ', label(i), '|', i['title'], '|', i['url'])
    for i, r in bad: print('BLOCKED  ', i['title'], '|', i['url'], '| rule:', r)
    for i in removed: print('REMOVED  ', label(i), '|', i['title'], '|', i['url'])
    for a, b in moved: print('MOVED    ', label(a), '->', label(b), '|', a['title'])
    for a, b in retitled: print('RETITLED ', a['title'], '->', b['title'])
    for i in dups: print('DUP-IN-DOC', i['title'], '|', i['url'])

def cmd_add(new_file):
    h = page(); text = data_of(h).split('\n'); cur = parse('\n'.join(text))
    new = parse(open(new_file, encoding='utf-8').read(), namemap(cur))
    have = {norm(i['url']) for i in cur}
    prev = None; n = 0
    for it in new:
        if norm(it['url']) in have or blocked(it):
            if norm(it['url']) in have: prev = it
            continue
        line = '- ' + ' @@ '.join([it['title'], it['url']] + ([it['note']] if it['note'] else []))
        cur = parse('\n'.join(text))
        pos = None
        if prev and sec(prev) == sec(it):                       # right after the preceding link in the doc
            for c in cur:
                if norm(c['url']) == norm(prev['url']) and sec(c) == sec(it): pos = c['line'] + 1
        if pos is None:                                         # else end of the section
            same = [c for c in cur if sec(c) == sec(it)]
            if same: pos = same[-1]['line'] + 1
        if pos is None: print('NO SECTION for', it['title'], label(it), '- add the heading by hand'); continue
        if it['sub'] and not any(c['sub'] == it['sub'] and sec(c) == sec(it) for c in cur):
            text[pos:pos] = ['### ' + it['sub'], line]
        else: text[pos:pos] = [line]
        have.add(norm(it['url'])); prev = it; n += 1
    open(PAGE, 'w', encoding='utf-8').write(DATA.sub(lambda m: m.group(1) + '\n'.join(text) + m.group(3), h, 1))
    print('added', n)

def cmd_remove(urls):
    h = page(); text = data_of(h).split('\n'); kill = {norm(u) for u in urls}; kw = kw_of(h)
    keep = [l for l in text if not (l.strip().startswith('- ') and len(l.split('@@')) > 1 and norm(l.split('@@')[1]) in kill)]
    print('removed', len(text) - len(keep), 'lines')
    still = {norm(i['url']) for i in parse('\n'.join(keep))}
    for u in list(kw):
        if norm(u) in kill and norm(u) not in still: del kw[u]
    h = DATA.sub(lambda m: m.group(1) + '\n'.join(keep) + m.group(3), h, 1)
    open(PAGE, 'w', encoding='utf-8').write(put_kw(h, kw))

def has_thumb(it):
    u = it['url']
    if YT.search(u) or u.startswith('/'): return True
    if re.search(r'javalab\.org/en/\w+?_en/|phet\.colorado\.edu/', u) or re.search(r'\.gif(\?|$)', u): return True
    return ("'" + u + "'") in page().split('const PREVIEWS')[1].split('previewCandidates')[0]

def cmd_todo():
    h = page(); kw = kw_of(h); items = parse(data_of(h)); seen = set(); out = []
    for i in items:
        k = i['url']
        if k in seen: continue
        seen.add(k)
        need_kw = k not in kw; need_th = not has_thumb(i)
        if need_kw or need_th:
            out.append(dict(url=k, title=i['title'], note=i['note'], where=label(i), need_keywords=need_kw, need_thumbnail=need_th))
    print(json.dumps(out, indent=0, ensure_ascii=False))

def cmd_kw(f):
    h = page(); d = kw_of(h)
    for u, s in json.load(open(f)).items():
        seen = []
        for t in s.lower().split(','):
            t = t.strip()
            if t and t not in seen: seen.append(t)
        d[u] = ', '.join(seen)
    open(PAGE, 'w', encoding='utf-8').write(put_kw(h, d)); print(len(d), 'urls with keywords')

def cmd_urls(mode):
    seen = set()
    for i in parse(data_of(page())):
        if i['url'].startswith('/') or i['url'] in seen: continue
        seen.add(i['url']); m = YT.search(i['url'])
        if mode == '--yt' and m: print(m.group(1), '|', i['title'])
        elif mode == '--other' and not m: print(i['url'], '|', i['title'])
        elif not mode: print(i['url'])

if __name__ == '__main__':
    a = sys.argv[1:]
    {'diff': lambda: cmd_diff(a[1]), 'add': lambda: cmd_add(a[1]), 'remove': lambda: cmd_remove(a[1:]),
     'todo': cmd_todo, 'kw': lambda: cmd_kw(a[1]), 'urls': lambda: cmd_urls(a[1] if len(a) > 1 else '')}.get(a[0] if a else '', lambda: print(__doc__))()
