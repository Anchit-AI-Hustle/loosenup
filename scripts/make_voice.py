"""Records the LoosenUp voice guide in Anchit's cloned voice, in English and Hindi.

Uses Chatterbox Multilingual (Resemble AI, MIT licence) with a 30 second reference clip.
Run from the repo root after `node scripts/voice-lines.mjs > .voice/lines.json`:

    .voice/venv/bin/python scripts/make_voice.py [--only en|hi] [--force]

Writes <out>/<lang>/<id>.m4a (AAC, mono, 48 kbps). Existing clips are kept unless --force is given.
Then copy the clips into www/voice and run node scripts/voice-manifest.mjs.
"""
import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, '.voice', 'lines.json')
REF = os.path.join(ROOT, '.voice', 'ref.wav')
# Clips are staged in .voice/clips; copy them into www/voice for a release.
OUT = os.environ.get('VOICE_OUT', os.path.join(ROOT, '.voice', 'clips'))


def clip_id(text):
    return hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', choices=['en', 'hi'])
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()

    lines = json.load(open(LINES, encoding='utf-8'))
    langs = [args.only] if args.only else ['en', 'hi']

    import torch
    import torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    device = 'mps' if torch.backends.mps.is_available() else 'cpu'
    model = ChatterboxMultilingualTTS.from_pretrained(device=device)
    torch.manual_seed(7)

    manifest = {'voice': 'Anchit (cloned with Chatterbox Multilingual)', 'lines': {}}
    for line in lines:
        cid = clip_id(line['en'])
        manifest['lines'][line['en']] = cid
        for lang in langs:
            dest_dir = os.path.join(OUT, lang)
            os.makedirs(dest_dir, exist_ok=True)
            dest = os.path.join(dest_dir, cid + '.m4a')
            if os.path.exists(dest) and not args.force:
                continue
            text = line[lang]
            # Calm pacing: low exaggeration and low guidance slow the delivery down.
            wav = model.generate(text, language_id=lang, audio_prompt_path=REF, exaggeration=0.35, cfg_weight=0.3, temperature=0.7)
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
                ta.save(tmp.name, wav, model.sr)
                subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '48000', '-c', '1', tmp.name, dest], check=True)
                os.unlink(tmp.name)
            print(lang, cid, text[:60], flush=True)

    print('done', len(lines), 'lines', file=sys.stderr)


if __name__ == '__main__':
    main()
