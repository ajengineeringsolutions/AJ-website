"""Optional: after editing source/site.css or source/site.js, run `python3 source/build.py`
from the website folder. It copies the CSS and JS INSIDE every page, so no page can ever
appear unstyled because a file failed to load. (Not needed for normal upload/deploy.)"""
import re,glob,os
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
css=open(os.path.join(root,'source/site.css')).read()
js=open(os.path.join(root,'source/site.js')).read()
pages=[os.path.join(root,'index.html')]+glob.glob(os.path.join(root,'*/index.html'))
for p in pages:
    h=open(p).read()
    h=re.sub(r'<style id="site-css">.*?</style>','<link rel="stylesheet" href="/assets/site.css">',h,flags=re.S)
    h=re.sub(r'<script id="site-js">.*?</script>','<script src="/assets/site.js" defer></script>',h,flags=re.S)
    h=re.sub(r'<link rel="stylesheet" href="/assets/site\.css[^"]*">',lambda m:'<style id="site-css">'+css+'</style>',h)
    h=re.sub(r'<script src="/assets/site\.js[^"]*" defer></script>',lambda m:'<script id="site-js">'+js+'</script>',h)
    open(p,'w').write(h)
    print('built',os.path.relpath(p,root))
