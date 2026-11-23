"""Run in a Git checkout: python scripts/build-admin-history.py [repo] [ref]."""
import subprocess,json,sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent
repo=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root
ref=sys.argv[2] if len(sys.argv)>2 else 'HEAD'
def git(*args):
    return subprocess.check_output(['git','-c','safe.directory='+repo.as_posix(),'-C',str(repo),*args]).decode('utf-8')
entries=[]
for record in git('log','--root','--name-only','--format=%x1e%H%x00%an%x00%cn%x00%aI%x00%cI%x00%B%x00',ref).split('\x1e')[1:]:
    parts=record.split('\0',6)
    fields=parts[:6]
    fields[-1]=fields[-1].strip()
    files=[line for line in parts[6].splitlines() if line]
    entries.append(dict(zip(['sha','author','committer','authoredAt','date','message'],fields),files=files))
out=root/'admin-history.json'
out.write_text(json.dumps({'sourceCommit':git('rev-parse',ref).strip(),'entries':entries},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'History: {len(entries)} records')
